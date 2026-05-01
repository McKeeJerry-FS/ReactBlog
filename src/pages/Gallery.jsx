import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { getGalleryImages } from '../api/gallery.js'
import { Helmet } from 'react-helmet-async'

export function Gallery() {
  const galleryQuery = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages(300),
  })

  const images = galleryQuery.data ?? []

  return (
    <div>
      <Helmet>
        <title>Image Gallery - Full Stack React Blog</title>
      </Helmet>
      <Header />
      <div className='container py-4'>
        <h1 className='h3 mb-3'>Image Gallery</h1>
        <p className='text-body-secondary'>
          All uploaded post images are saved here and can be reused in your
          portfolio.
        </p>
        {galleryQuery.isError && (
          <div className='alert alert-danger' role='alert'>
            Failed to load gallery images.
          </div>
        )}
        {galleryQuery.isLoading ? (
          <div className='text-body-secondary'>Loading gallery...</div>
        ) : (
          <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4'>
            {images.map((image) => (
              <div key={image.id} className='col'>
                <div className='card h-100 shadow-sm'>
                  <img
                    src={image.url}
                    alt={image.filename}
                    className='card-img-top'
                    style={{ height: 220, objectFit: 'cover' }}
                    loading='lazy'
                  />
                  <div className='card-body'>
                    <div className='small text-body-secondary mb-1'>
                      {new Date(image.createdAt).toLocaleString()}
                    </div>
                    <a
                      href={image.url}
                      target='_blank'
                      rel='noreferrer'
                      className='small text-break'
                    >
                      {image.url}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
