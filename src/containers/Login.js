import React from 'react'
import { auth, db } from '~/services/firebase'
import { withRouter } from 'react-router-dom'
import * as routes from '~/services/utils/routes'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import googleLogo from '~/assets/GoogleLogo.svg'
import { primaryColor } from '~/services/utils/colors'
import logoWhite from '~/assets/logo-white.png'
const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .content {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  aside {
    flex-grow: 2;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    background-color: ${primaryColor};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    h1 {
      font-size: 3rem;
    }
    p {
      font-size: 16px;
      line-height: 1.8rem;
    }
  }
  section {
    flex-grow: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  footer {
    height: 70px;
    border-top: 1px solid #cab8b8;
    padding: 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media only screen and (max-width: 768px) {
    .content {
      flex-direction: column;
    }
    aside {
      height: 100%;
      padding: 10px 20px;
      h2,
      p {
        text-align: center;
      }
    }
  }
  @media only screen and (max-width: 320px) {
    aside {
      p {
        font-size: 12px;
        line-height: 1;
      }
    }
  }
`

const GoogleSignInButton = styled.button`
  display: flex;
  border: none;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  line-height: 48px;
  font-weight: 500;
  color: #fff;
  padding: 2px 6px 2px 3px
  background-color: #4285f4;
  cursor: pointer;
  opacity: 1;
  &:hover {
    transform: scale(1.01);
    opacity: 0.9;
  }
  span.svg-wrapper {
    margin-right: 4px;
    background-color: white;
  }
`
const Login = ({ history }) => {
  const signInUser = () => {
    auth.signIn().then(info => {
      if (info && info.additionalUserInfo.isNewUser) {
        const { uid, displayName, email, photoURL } = info.user
        db.setUserAPI({ uid, displayName, email, photoURL })
      } else {
        db.setUserRef(info.user.uid)
      }
      history.push(routes.HOME)
    })
  }
  return (
    <Wrapper>
      <div className="content">
        <aside>
          <img src={logoWhite} alt="Logo" />
          <h2>Build your custom forms in minutes!</h2>
          <p>
            Are you building a chatbot and need a form to get data from your
            user?
            <br />
            MockBird helps you by dealing with all the development and hosting!
            <br />
            Just choose a template and create your screens and components!
            <br />
          </p>
        </aside>
        <section>
          <h2>Log in and try it now!</h2>
          <GoogleSignInButton onClick={() => signInUser()}>
            <span className="svg-wrapper">
              <img src={googleLogo} alt="Google Logo" />
            </span>
            Sign in with Google
          </GoogleSignInButton>
        </section>
      </div>
      <footer>
        Made with
        <span role="img" aria-label="heart">
          ❤️
        </span>
        by
        <a className="ml1" target="blank" href="https://github.com/davidpn11">
          @davidpn11
        </a>
        -<strong className="ttu ml3"> under development</strong>
      </footer>
    </Wrapper>
  )
}

Login.propTypes = {
  history: PropTypes.any.isRequired,
}

export default withRouter(Login)
