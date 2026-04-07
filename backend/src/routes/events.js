import { 
    trackEvent,
    getTotalViews,
    getDailyViews,
    getDailyDurations, 
} from '../services/events.js';

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

    app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await getPostById(postId);
            if ( post === null) return res.status(400).end()
            const stats = await getTotalViews(postId);
            return res.json(stats);    
        } catch (error) {
            console.error('Error getting stats:', error);
            return res.status(500).end()
        }
    })

    app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await getPostById(postId);
            if ( post === null) return res.status(400).end()
            const stats = await getDailyViews(postId);
            return res.json(stats);    
        } catch (error) {
            console.error('Error getting stats:', error);
            return res.status(500).end()
        }   
    })

    app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await getPostById(postId);
            if ( post === null) return res.status(400).end()
            const stats = await getDailyDurations(postId);
            return res.json(stats);    
        } catch (error) {
            console.error('Error getting stats:', error);
            return res.status(500).end()
        }   
    })
}