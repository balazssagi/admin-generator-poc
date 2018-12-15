import * as React from 'react'
import { Router, Link } from '@reach/router'
import { EditResource, ListResource } from './Resouce'

export interface IField {
    name: string
    type: 'text' | 'longText' | 'reference',
    showInList?: boolean
    filterable?: boolean,
    references?: IResource
}

export interface IResource {
    name: string
    url: string
    descriptiveField: string
    fields: IField[],
}

interface Props {
    resources: IResource[]
}

const List: React.SFC<{ path: string; resource: IResource }> = ({ resource }) => <ListResource resource={resource} />
const Edit: React.SFC<{ path: string; resource: IResource }> = ({ resource }) => <EditResource resource={resource} />

const ResourceList: React.SFC<{path: string}> = ({children}) => <div>{children}</div>

class Admin extends React.Component<Props, null> {
    render() {
        const { resources } = this.props

        return (
            <div className="admin">
                <aside className="aside">
                    <ul>
                        {resources.map(resource => (
                            <li key={resource.name} >
                                <Link to={resource.url}> {resource.name} </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="main">
                    <Router>
                        {resources.map(resource => (
                            <ResourceList key={resource.name} path={resource.url}>
                                <List path="/" resource={resource} />
                                <Edit path="/:id" resource={resource} />
                            </ResourceList>
                        ))}
                    </Router>
                </main>
            </div>
        )
    }
}

export { Admin }
