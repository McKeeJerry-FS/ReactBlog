import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import slug from 'slug'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { uploadGalleryImage } from '../api/gallery.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'medium',
        parseHTML: (element) => element.getAttribute('data-size') || 'medium',
        renderHTML: (attributes) => ({
          'data-size': attributes.size || 'medium',
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align || 'center',
        }),
      },
    }
  },
})

function TipTapToolbar({ editor, onImageUpload, isUploadingImage }) {
  if (!editor) return null

  const imageIsSelected = editor.isActive('image')

  const setSelectedImageSize = (size) => {
    editor.chain().focus().updateAttributes('image', { size }).run()
  }

  const setSelectedImageAlign = (align) => {
    editor.chain().focus().updateAttributes('image', { align }).run()
  }

  return (
    <div className='tiptap-toolbar'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
        title='Bold'
      >
        <strong>B</strong>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
        title='Italic'
      >
        <em>I</em>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
        title='Heading'
      >
        H2
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
        title='Subheading'
      >
        H3
      </button>
      <span className='tiptap-toolbar-sep' />
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'active' : ''}
        title='Bullet list'
      >
        &#8226; List
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'active' : ''}
        title='Numbered list'
      >
        1. List
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'active' : ''}
        title='Blockquote'
      >
        &ldquo;&rdquo;
      </button>
      <span className='tiptap-toolbar-sep' />
      <button
        type='button'
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (!url) return
          editor.chain().focus().setLink({ href: url }).run()
        }}
        className={editor.isActive('link') ? 'active' : ''}
        title='Link'
      >
        Link
      </button>
      <button
        type='button'
        onClick={onImageUpload}
        disabled={isUploadingImage}
        title='Upload image'
      >
        {isUploadingImage ? 'Uploading…' : 'Image'}
      </button>
      <button
        type='button'
        onClick={() => setSelectedImageSize('small')}
        className={
          imageIsSelected && editor.getAttributes('image').size === 'small'
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Small image width'
      >
        S
      </button>
      <button
        type='button'
        onClick={() => setSelectedImageSize('medium')}
        className={
          imageIsSelected && editor.getAttributes('image').size === 'medium'
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Medium image width'
      >
        M
      </button>
      <button
        type='button'
        onClick={() => setSelectedImageSize('full')}
        className={
          imageIsSelected && editor.getAttributes('image').size === 'full'
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Full image width'
      >
        Full
      </button>
      <span className='tiptap-toolbar-sep' />
      <button
        type='button'
        onClick={() => setSelectedImageAlign('left')}
        className={
          imageIsSelected && editor.getAttributes('image').align === 'left'
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Align image left'
      >
        &#8676;
      </button>
      <button
        type='button'
        onClick={() => setSelectedImageAlign('center')}
        className={
          imageIsSelected &&
          (editor.getAttributes('image').align === 'center' ||
            !editor.getAttributes('image').align)
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Center image'
      >
        &#8596;
      </button>
      <button
        type='button'
        onClick={() => setSelectedImageAlign('right')}
        className={
          imageIsSelected && editor.getAttributes('image').align === 'right'
            ? 'active'
            : ''
        }
        disabled={!imageIsSelected}
        title='Align image right'
      >
        &#8677;
      </button>
      <span className='tiptap-toolbar-sep' />
      <button
        type='button'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title='Undo'
      >
        ↩
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title='Redo'
      >
        ↪
      </button>
    </div>
  )
}

TipTapToolbar.propTypes = {
  editor: PropTypes.object,
  onImageUpload: PropTypes.func.isRequired,
  isUploadingImage: PropTypes.bool.isRequired,
}

export function CreatePost() {
  const { token } = useAuth()

  const [title, setTitle] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const imageInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your post…' }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-input',
      },
    },
    immediatelyRender: false,
    content: '',
  })

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError('')
    setIsUploadingImage(true)

    try {
      const result = await uploadGalleryImage(token, file)
      editor.chain().focus().setImage({ src: result.url, size: 'medium' }).run()
    } catch (error) {
      setUploadError(error?.message || 'Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploadError('')

    const contents = editor ? editor.getHTML() : ''

    await createPost({
      variables: {
        title,
        contents,
        imageUrl: null,
      },
    })
  }

  if (!token)
    return (
      <div className='alert alert-warning' role='alert'>
        Please log in to create new posts.
      </div>
    )

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label htmlFor='create-title' className='form-label fw-semibold'>
          Title
        </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-control'
          placeholder='Enter post title...'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='tiptap-editor' className='form-label fw-semibold'>
          Contents
        </label>
        <div
          className='tiptap-wrapper'
          id='tiptap-editor'
          role='group'
          aria-label='Post contents editor'
        >
          <TipTapToolbar
            editor={editor}
            onImageUpload={() => imageInputRef.current?.click()}
            isUploadingImage={isUploadingImage}
          />
          <EditorContent editor={editor} className='tiptap-editor' />
        </div>
        <input
          ref={imageInputRef}
          type='file'
          accept='image/*,.heic,.heif'
          style={{ display: 'none' }}
          onChange={handleImageFileChange}
        />
        <div className='form-text'>
          Select an image, then click the image and use S, M, or Full to resize.
        </div>
      </div>

      <button
        type='submit'
        className='btn btn-primary'
        disabled={!title || loading || isUploadingImage}
      >
        {loading || isUploadingImage ? (
          <>
            <span
              className='spinner-border spinner-border-sm me-2'
              role='status'
              aria-hidden='true'
            />
            {isUploadingImage ? 'Uploading image...' : 'Creating...'}
          </>
        ) : (
          'Create Post'
        )}
      </button>
      {uploadError && (
        <div className='alert alert-danger mt-3' role='alert'>
          {uploadError}
        </div>
      )}
      {data?.createPost && (
        <div className='alert alert-success mt-3' role='alert'>
          Post{' '}
          <RouterLink
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            <strong>{data.createPost.title}</strong>
          </RouterLink>{' '}
          created successfully!
        </div>
      )}
    </form>
  )
}
