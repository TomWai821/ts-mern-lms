import { Router, Express } from 'express'

// routes
import userRoutes from './api/user';
import bookRoutes from './api/books';
import definitionRoutes from './api/definition'
import contactRoutes from './api/contact'
import recommendRoutes from './api/recommend'
import selfRecordRoutes from './api/me'
import dashboardRoutes from './api/dashboard'
import healthRoutes from './health'
import taskRoutes from './task'

const routerList:Record<string, Router> = 
{
    '/api/user': userRoutes,
    '/api/book': bookRoutes,
    '/api/definition': definitionRoutes,
    '/api/contact': contactRoutes,
    '/api/recommend': recommendRoutes,
    '/api/me': selfRecordRoutes,
    '/api/dashboard': dashboardRoutes,
    '/health': healthRoutes,
    '/tasks': taskRoutes
}

export const routerHandler = (app: Express) => 
{
    Object.entries(routerList).forEach(([path,router]) =>
    {
        app.use(path,router);
    })
}