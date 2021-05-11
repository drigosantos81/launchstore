async function post(req, res, next) {
  const keys = Object.keys(req.body);

  // VALIDAÇÃO NO FRONTEND(Na página)
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor, preencha todos os campos.");
    }
  }

  // VALIDAÇÃO NO BACKEND(No servidor)
  if (!req.files || req.files.length == 0) {
    return res.send('Por favor, envie pelo menos uma imagem.');
  }

  next();
}

async function put(req, res, next) {
  const keys = Object.keys(req.body);

  // VALIDAÇÃO NO FRONTEND(Na página)
  for (key of keys) {
    if (req.body[key] == "" && key != "removed_files") {
      return res.send("Por favor, preencha todos os campos.");
    }
  }

  next();
}

module.exports = {
  post,
  put
}