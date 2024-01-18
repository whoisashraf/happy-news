/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import User from '../app/Models/User'
import CheckUserValidator from '../app/Validators/CheckUserValidator'




Route.resource('articles', 'ArticlesController').paramFor('articles', 'slug').middleware({
  create:['auth'],
  store:['auth'],
  edit:['auth'],
  update:['auth'],
  destroy:['auth'],
})

Route.on('/register').render('register').as('register')

Route.group(() => {
  Route.on('/').render('welcome').as('welcome')
}).middleware('auth')


Route.post('/register', async ({ request, response }) => {
  const payload = await request.validate(CheckUserValidator)
  const { email, password } = payload
  const user = new User()
  user.email = email
  user.password = password
  await user.save()

  return response.redirect('/articles')
}).as('users.register')

Route.on('/login').render('login').as('login')

Route.post('/login', async ({ auth, request, response }) => {
  const payload = await request.validate(CheckUserValidator)
  const { email, password } = payload
  await auth.use('web').attempt(email, password)
  return response.redirect('/articles')
}).as('users.login')

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/articles')
}).as('users.logout').middleware('auth')
