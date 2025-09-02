import { dataAuth } from "../dataAuth.js"

export const getAllAuth = (req, res) => {
  res.json({ data: dataAuth })
}

export const postAuth = (req, res) => {
  const login = req.body.login
  const password = req.body.password

  const newDataAuth = { id: dataAuth.length + 1, login, password }
  dataAuth.push(newDataAuth)

  res.json({ data: [newDataAuth] })
}


