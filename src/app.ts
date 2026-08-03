import express from 'express';
import path from 'path';

import apiRoutes from './routes/apiRoutes';
import authRoutes from './routes/authRoutes';
import pageRoutes from './routes/pageRoutes';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', pageRoutes);

app.use((req, res) => {
    res.status(404).render('erro', {
        mensagem: 'Página não encontrada'
    });
});

export default app;