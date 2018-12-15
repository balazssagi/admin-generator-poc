import * as React from 'react'
import { IResource, IField, FieldTypes } from './Admin'
import { Link } from '@reach/router'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { resources } from './testData'

interface Props {
    resource: IResource
}

class EditResource extends React.Component<Props, null> {
    renderFieldInput(field: IField<FieldTypes>) {
        switch (field.type) {
            case FieldTypes.string:
                return <input type="text" />
            case FieldTypes.longText:
                return <textarea />
        }
    }

    render() {
        const { resource } = this.props

        return resource.fields.map(field => (
            <label
                key={field.name}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {field.name}
                {this.renderFieldInput(field)}
            </label>
        ))
    }
}

class Filter extends React.Component<any> {
    state = {
        isFiltering: false,
    }

    render() {
        if (this.state.isFiltering) {
            return (
                <React.Fragment>
                    <input
                        placeholder={`Filtering by ${this.props.column.Header}`}
                        value={
                            this.props.filter && this.props.filter.value
                                ? this.props.filter.value
                                : ''
                        }
                        onChange={e => this.props.onChange(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            this.props.onChange('')
                            this.setState({
                                isFiltering: false,
                            })
                        }}
                    >
                        x
                    </button>
                </React.Fragment>
            )
        } else {
            return (
                <button
                    onClick={() => {
                        this.setState({ isFiltering: !this.state.isFiltering })
                    }}
                >
                    Filter by {this.props.column.Header}
                </button>
            )
        }
    }
}

class ListResource extends React.Component<Props, null> {
    render() {
        const { resource } = this.props

        const columns: any[] = resource.fields
            .filter(field => field.options.showInList !== false)
            .map(field => ({
                Header:
                    field.type === FieldTypes.reference
                        ? field.options.references.name
                        : field.name,
                accessor: field.name,
                filterable: field.options.filterable,
                Cell:
                    field.type === FieldTypes.reference
                        ? row => {
                              return (
                                  <Link
                                      to={`${field.options.references.url}/${
                                          row.original[field.name]
                                      }`}
                                  >
                                      {
                                          resources[
                                              field.options.references.name
                                          ].find(
                                              resource =>
                                                  resource.id ===
                                                  row.original[field.name]
                                          )[
                                              field.options.references
                                                  .descriptiveField
                                          ]
                                      }
                                  </Link>
                              )
                          }
                        : undefined,
            }))

        columns.push({
            accessor: 'edit',
            width: 50,
            Cell: props => {
                const original = props.original
                return <Link to={`./${original.id}`}>Edit</Link>
            },
        })

        return (
            <ReactTable
                data={resources[resource.name]}
                columns={columns}
                minRows={0}
                FilterComponent={props => <Filter {...props} />}
                className={'-highlight -striped'}
                SubComponent={
                    resource.fields.some(
                        resource => resource.options.showInList === false
                    )
                        ? row => {
                              const original = row.original
                              const keys = Object.getOwnPropertyNames(original)
                              return (
                                  <ul style={{ paddingInlineStart: 15 }}>
                                      <li>
                                          {keys.map(key => (
                                              <div>
                                                  <strong>{key}: </strong>
                                                  <span>{original[key]}</span>
                                              </div>
                                          ))}
                                      </li>
                                  </ul>
                              )
                          }
                        : undefined
                }
            />
        )
    }
}

export { EditResource, ListResource }
