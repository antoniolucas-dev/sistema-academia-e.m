import express from 'express';
import path from 'path';

// Importando os arquivos que você realmente tem na pasta routes
import apiRoutes from './routes/apiRoutes';
import authRoutes from './routes/authRoutes';
import pageRoutes from './routes/pageRoutes';

const app = express();

// Configura o EJS como motor de visualização (View Engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (aponta para a pasta public na raiz do projeto)
app.use(express.static(path.join(__dirname, '../public')));

// Rotas do projeto
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', pageRoutes);

// Handler para 404
app.use((req, res) => {
  res.status(404).render('erro', { mensagem: 'Página não encontrada' });
});

export default app;