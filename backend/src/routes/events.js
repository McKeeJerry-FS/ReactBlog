import { trackEvent } from '../services/events.js';
import { getPostById } from '../services/posts.js';

export function eventRoutes(app) {
    app.post('/api/v1/events', async (req, res) => {
        try {
            const { postId, session, action } = req.body;
            const post = await getPostById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            const event = await trackEvent({ postId, action, session });
            return res.json({ session: event.session });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
}