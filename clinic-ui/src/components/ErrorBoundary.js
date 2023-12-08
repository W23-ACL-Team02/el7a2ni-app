import { Snackbar } from '@mui/base';
import React from 'react';
export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: ""};
    }
    
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.    
        return { hasError: true };  
        this.setState({error: error})
        console.log("error caught " + error)
    }
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
      this.setState({error: error})
      console.log("error caught " + error)
      // You can also log the error to an error reporting service
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <Snackbar>{this.state.error}</Snackbar>
      }
      return this.props.children;
    }
  }