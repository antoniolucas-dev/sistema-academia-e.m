import express from "express";
import path from "path";

import pageRoutes from "./routes/pageRoutes";
import apiRoutes from "./routes/apiRoutes";
import alunoRoutes from "./routes/AlunoRoutes";


const app = express();


app.use(express.json());
app.use(express.urlencoded({
extended:true
}));


app.use(express.static(
path.join(__dirname,"../public")
));


app.set(
"view engine",
"ejs"
);


app.set(
"views",
path.join(__dirname,"views")
);



app.use("/",pageRoutes);


app.use(
"/api",
apiRoutes
);


app.use(
"/api/alunos",
alunoRoutes
);



export default app;

