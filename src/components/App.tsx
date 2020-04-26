import * as React from 'react'
import {Toggle} from './Toggle'
// tslint:disable-next-line:import-name
import ReCAPTCHA from 'react-google-recaptcha'
import {postData} from './utils'
const elonMusk1 = require('../img/elon1.jpg')
// tslint:disable-next-line:import-name
import Typist from 'react-typist';

const API_URL = process.env.API_URL || 'http://localhost:8000'

export class App extends React.Component {
  state = {
    loves: 0,
    recaptchaVal: undefined,
    error: undefined,
    submitted: false,
    renderMsg1: false,
    renderMsg2: false
  }

  recaptchaRef : any = React.createRef()
  onChange = (value : any) => {
    this.setState({recaptchaVal: value})
  }

  refreshEveryFewSec = () => {
    setInterval(async() => {
      await this.refreshLoves()
    }, 3000)
  }

  componentWillMount() {
    this.refreshLoves()
    this.refreshEveryFewSec()
  }

  onSubmit = async(event : any) => {
    event.preventDefault()
    this.setState({error: undefined, submitted: false});
    await postData(`${API_URL}/api/love/`, {'g-recaptcha-response': this.state.recaptchaVal}).then(async() => {
      await this.refreshLoves()
      this.setState({submitted: true, recaptchaVal: undefined})
      localStorage.setItem('sent', '1');
      this.render();
    }).catch(error => {
      this.setState({error: 'We were unable to send your ❤️ please try again.'})
    })
  }

  refreshLoves = async() => {
    const json = await fetch(`${API_URL}/api/love/`).then(response => {
      return response.json()
    })
    this.setState({loves: json.loves})
  }

  onHeaderTyped = () => {
    this.setState({renderMsg1: true});
  }

  render() {
    console.log(this.state.loves)
    return (
      <div id="container">
        <img
          src={elonMusk1}
          style={{
          width: 200,
          borderRadius: 20
        }}/>
        <Typist
          cursor={{
          show: false
        }}
          className="TypistExample-header"
          avgTypingDelay={40}
          startDelay={1000}
          onTypingDone={this.onHeaderTyped}>
          <div>
            <a href="https://en.wikipedia.org/wiki/Elon_Musk">Elon musk</a>
            {' '}
            <span>
              is a legend.
              <Typist.Backspace count={7} delay={1000}/>

              pro.
              <Typist.Backspace count={4} delay={1000}/>

              super human.
            </span>
          </div>
          <div>
            I want to show some love to the legend.</div>

        </Typist>

        {this.state.renderMsg1 && <form method="post" onSubmit={this.onSubmit}>
          <div>
            {this.state.error}</div>
          <ReCAPTCHA
            theme="light"
            ref={this.recaptchaRef}
            sitekey="6LeaGO4UAAAAAOFIyoA4eKe6qjhx2e5K80zdJ5K5"
            onChange={this.onChange}/>
          <button type="submit" className="loveButton">
            {`${this.state.loves} ❤️`}
          </button>
        </form>
}
      </div>
    )
  }
}
