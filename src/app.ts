/// <reference path="./types/session.d.ts" />
import express from 'express';
import path from 'path';
import session from 'express-session';

import apiRoutes from './routes/apiRoutes';
import authRoutes from './routes/authRoutes';
import pageRoutes from './routes/pageRoutes';
import alunoRoutes from './routes/alunoRoutes';
import treinoRoutes from './routes/treinoRoutes';
import exercicioRoutes from './routes/exercicioRoutes';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'academia-em-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// Deixa o usuário logado disponível em todas as views (ex: <% if (usuario.tipo === 'Aluno') %>)
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/', pageRoutes);

app.use((req, res) => {
    res.status(404).render('erro', {
        mensagem: 'Página não encontrada'
    });
});

export default app;