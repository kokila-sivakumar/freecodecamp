class Application extends React.Component {
    render() {
      return (
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1 className="text-center">Markdown Previewer</h1>
              <hr />
            </div>
          </div>
          <UserInput />
        </div>
      )
    }
  }
  
  class UserInput extends React.Component {
    constructor() {
      super();
      this.state = {
        md: ''
      };
    }
    
    updatePreview(e) {
      this.setState({
        md: e.target.value
      });
    }
    
    render() {
      return (
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-center">Markdown</h3>
            <textarea type="text" className="md-input" value={this.state.md} onChange={this.updatePreview.bind(this)}/>
          </div>
          <div className="col-md-6">
            <h3 className="text-center">Previewer</h3>
            <MarkdownPreview markdown={this.state.md} />
          </div>
        </div>
      )
    }
  }
  
  class MarkdownPreview extends React.Component {
    
    createMarkup() {
      return { __html: marked(this.props.markdown) }
    }
    
    render() {
      return (
        <div className="well" dangerouslySetInnerHTML={this.createMarkup()}>
        </div>
      )
    }
  }
  
  React.render(<Application />, document.getElementById('app'));