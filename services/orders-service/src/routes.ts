import { FastifyInstance } from 'fastify';
import { createOrderHandler, listOrdersHandler, updateStatusHandler, getOrderHandler, createCheckoutOrderHandler } from './controller';

export const orderRoutes = async (server: FastifyInstance) => {
    server.post('/', createOrderHandler);
    server.post('/checkout', createCheckoutOrderHandler);
    server.get('/', listOrdersHandler);
    server.get('/:id', getOrderHandler);
    server.post('/:id/status', updateStatusHandler);
};
