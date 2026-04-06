import dotenv from 'dotenv';
dotenv.config();
import globalSetup from './test/globalSetup';
import { app } from './app';
import { initDatabase } from './db/init';

async function runTestingServer() {
    await globalSetup();
    await initDatabase();
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Testing server is running on port ${PORT}`);
    });
}

runTestingServer();