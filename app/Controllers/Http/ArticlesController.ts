// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateArticleValidator from "../../Validators/CreateArticleValidator"
import Article from "../../Models/Article"
import Application from "@ioc:Adonis/Core/Application";
import fs from 'fs'
// import path from 'path'

export default class ArticlesController {
    public async index({ view }) {
        // const articles = await Article.all()
        const articles = await Article.query().orderBy('id', 'asc')
        return view.render('articles/view', { articles })
    }

    public async create({ view }) {
        return view.render('articles/create')
    }

    public async store({ response, request }) {
        const payload = await request.validate(CreateArticleValidator)
        await payload.image.move(Application.publicPath("images"));
        payload.image = payload.image.fileName;
        await Article.create(payload)
        return response.redirect('/articles')
    }

    public async edit({ view, params }) {
        const article = await Article.findBy('slug', params.slug)
        return view.render('articles/edit', { article })
    }

    public async show({ view, params }) {
        const article = await Article.findBy('slug', params.slug)
        return view.render('articles/show', { article })
    }

    public async update({ request, response, params }) {
        const payload = await request.validate(CreateArticleValidator)
        await payload.image.move(Application.publicPath("images"));
        payload.image = payload.image.fileName;
        await Article.query().where('slug', params.slug).update(payload)
        return response.redirect('/articles')
    }

    public async destroy({ params, response }) {
        const article = await Article.findBy('slug', params.slug)
        if (article) {
            article.delete()
            fs.unlink(`public/images/${article.image}`,(error)=>{
                if (error) {
                    // console.log(error);
                    // return
                }
            })
            return response.redirect('/articles')
        }
    }
}
