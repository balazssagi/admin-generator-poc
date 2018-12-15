import * as React from 'react'
import { Router, Link } from '@reach/router'
import { EditResource, ListResource } from './Resouce'

export interface IField<Type extends FieldTypes> {
    name: string
    type: Type
    options: IFieldOptions
}

interface IFieldOptions {
    showInList?: boolean
    filterable?: boolean
    references?: IResource | string
}

interface IResourceOptions {
    name: string
    url: string
    descriptiveField: string
    fields: IField<FieldTypes>[]
}

export function createResource(options: IResourceOptions): IResource {
    const resource: IResource = {
        name: options.name,
        url: options.url,
        descriptiveField: options.descriptiveField,
        fields: options.fields,
    }

    if (
        !resource.fields.some(field => field.name === resource.descriptiveField)
    ) {
        throw new Error('Please')
    }

    return resource
}

export function createField<Type extends FieldTypes>(
    type: Type,
    name: string,
    options?: Partial<IFieldOptions>
): IField<Type> {
    if (type === FieldTypes.reference && options.references === undefined) {
        throw new Error('Plese')
    }
    const field: IField<Type> = {
        name: name,
        type: type,
        options: {
            showInList: true,
            filterable: true,
            ...options,
        },
    }
    return field
}

export interface IResource {
    name: string
    url: string
    descriptiveField: string
    fields: IField<FieldTypes>[]
}

interface Props {
    resources: IResource[]
}

export enum FieldTypes {
    string = 'STRING',
    longText = 'LONG_TEXT',
    reference = 'REFERENCE',
}

const List: React.SFC<{ path: string; resource: IResource }> = ({
    resource,
}) => <ListResource resource={resource} />

const Edit: React.SFC<{ path: string; resource: IResource }> = ({
    resource,
}) => <EditResource resource={resource} />

const ResourceList: React.SFC<{ path: string }> = ({ children }) => (
    <div>{children}</div>
)

const normaliseResouces = (resources: IResource[]): IResource[] => {
    return resources.map(resource => {
        return {
            ...resource,
            fields: resource.fields.map(field => {
                if (field.type === FieldTypes.reference) {
                    return {
                        ...field,
                        options: {
                            ...field.options,
                            references:
                                typeof field.options.references === 'string'
                                    ? field.options.references
                                    : field.options.references.name,
                        },
                    }
                } else {
                    return field
                }
            }),
        }
    })
}

class Admin extends React.Component<Props, { resources: IResource[] }> {
    state: { resources: IResource[] } = {
        resources: [],
    }

    componentDidMount() {
        this.setState(
            {
                resources: normaliseResouces(this.props.resources),
            },
            () => {
                console.log(this.state)
            }
        )
    }

    render() {
        const { resources } = this.state

        return (
            <div className="admin">
                <aside className="aside">
                    <ul>
                        {resources.map(resource => (
                            <li key={resource.name}>
                                <Link to={resource.url}> {resource.name} </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="main">
                    <Router>
                        {resources.map(resource => (
                            <ResourceList
                                key={resource.name}
                                path={resource.url}
                            >
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
