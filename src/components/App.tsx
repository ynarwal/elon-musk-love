import * as React from 'react'
import {Toggle} from './Toggle'
// tslint:disable-next-line:import-name
import ReCAPTCHA from 'react-google-recaptcha'
import {postData} from './utils';
const elonMusk1 = require('../img/elon1.jpg')

const API_URL = process.env.API_URL || 'http://localhost:8000';

export class App extends React.Component {

  state = {
    loves: 0,
    recaptchaVal: undefined,
    buttonText: 'Send ❤️ to ELON',
    submitted: false
  }

  recaptchaRef = React.createRef();
  onChange = (value : any) => {
    this.setState({recaptchaVal: value});
  }

  refreshEvery2Sec = () => {
    setInterval(async() => {
      await this.refreshLoves();
    }, 2000);
  }

  componentWillMount() {
    this.refreshLoves();
    this.refreshEvery2Sec();
  }

  onSubmit = async(event : any) => {
    event.preventDefault();
    await postData(`${API_URL}/api/love/`, {'g-recaptcha-response': this.state.recaptchaVal}).then(async() => {
      await this.refreshLoves();
      this.setState({submitted: true, recaptchaVal: undefined});
    }).catch((error) => {
      this.setState({buttonText: 'We were unable to send your ❤️, please try again.'});

    })
  }

  refreshLoves = async() => {
    const json = await fetch(`${API_URL}/api/love/`).then((response) => {
      return response.json();
    })
    this.setState({loves: json.loves})
  }

  render() {
    return (
      <div
        id="container"
        style={{
        backgroundImage: `url(${elonMusk1})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>

        {this.state.submitted
          ? <button
              className="loveButton"
              onClick={() => this.setState({submitted: false})}>
              Submit one more time</button>
          : <form method="post" onSubmit={this.onSubmit} hidden={this.state.submitted}>
            <ReCAPTCHA
              theme="light"
              ref={this.recaptchaRef}
              sitekey="6LeaGO4UAAAAAOFIyoA4eKe6qjhx2e5K80zdJ5K5"
              onChange={this.onChange}/>
            <button type="submit" className="loveButton">
              {this.state.buttonText}</button>

          </form>
}
        <div className="stats">
          Total ❤️ Sent = {this.state.loves}
        </div>
      </div>
    )
  }
}