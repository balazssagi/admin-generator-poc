import * as React from 'react'
import { Admin, FieldTypes, createField, createResource } from '../lib/Admin'
import './style.css'

const { longText, string, reference } = FieldTypes

const users = createResource({
    name: 'User',
    url: '/user',
    descriptiveField: 'name',
    fields: [createField(string, 'name'), createField(string, 'id')],
})

const tables = createResource({
    name: 'Tables',
    url: '/table',
    descriptiveField: 'table',
    fields: [createField(string, 'table'), createField(string, 'id')],
})

const posts = createResource({
    name: 'Post',
    url: '/post',
    descriptiveField: 'title',
    fields: [
        createField(string, 'id', { filterable: false }),
        createField(reference, 'userId', {
            filterable: true,
            references: users,
        }),
        createField(string, 'title'),
        createField(longText, 'body'),
    ],
})

const resources = [users, posts, tables]

class App extends React.Component {
    render() {
        return <Admin resources={resources} />
    }
}

export { App }
