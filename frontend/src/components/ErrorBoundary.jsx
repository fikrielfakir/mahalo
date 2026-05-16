import { Component } from 'react'
import ServerErrorPage from '../pages/ServerErrorPage'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ServerErrorPage
          error={this.state.error}
          resetError={this.reset}
        />
      )
    }
    return this.props.children
  }
}
