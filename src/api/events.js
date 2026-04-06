export const postTrackEvent = (event) => 
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    }).then ((res) => res.json())