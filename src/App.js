import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Loader from "react-loader-spinner";

function App() {
  const [url, setUrl] = useState("");
  const [transformedUrl, setTransformedUrl] = useState(null);
  const [showShortLink, setShowShortLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");

  const urlChangeHandler = (event) => {
    setUrl(event.target.value);
  };

  const shortifyUrlHandler = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: "cbdce488eeb348fdf515b2a086a07038f9246bfb",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: url }),
      };

      const response = await fetch("https://api-ssl.bitly.com/v4/shorten", requestOptions);
      if (response.ok) {
        setHasError(null);
        const data = await response.json();
        setTransformedUrl(data.link);
        setIsLoading(false);
        setShowShortLink(true);
        toast("Click on the link to copy the URL");
      } else {
        throw new Error("Please enter a valid url");
      }
    } catch (error) {
      setHasError(error.message);
    }
  };

  const transformedLinkClickHandler = () => {
    navigator.clipboard.writeText(transformedUrl);
    toast("Copied link to your Clipboard");
  };

  return (
    <Container maxWidth='md'>
      <ToastContainer />
      <div className='header'>
        <h2 style={{ margin: "25px", color: "rgb(51, 111, 223)" }}>LINK SHORTENER</h2>
        <TextField
          variant='outlined'
          color='primary'
          id='url'
          value={url}
          onChange={urlChangeHandler}
          placeholder='Enter the url here'
          fullWidth={true}
        />
        <Button
          variant='outlined'
          color='primary'
          size='large'
          style={{ margin: "25px" }}
          onClick={shortifyUrlHandler}
        >
          Shortify
        </Button>

        <div className='results-section'>
          {isLoading && !hasError && <Loader type='ThreeDots' color='rgb(51, 111, 223)' />}
          {showShortLink && <p onClick={transformedLinkClickHandler}>{transformedUrl}</p>}
          {hasError && <p>{hasError}</p>}
        </div>
      </div>
    </Container>
  );
}

export default App;
