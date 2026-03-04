import { Router, Express } from 'express'

// routes
import userRoutes from './routes/user';
import bookRoutes from './routes/books';
import healthRoutes from './routes/health'

const routerList:Record<string, Router> = 
{
    '/api/user': userRoutes,
    '/api/book': bookRoutes,
    '/health': healthRoutes
}

export const routerHandler = (app: Express) => 
{
    Object.entries(routerList).forEach(([path,router]) =>
    {
        app.use(path,router);
    })
}