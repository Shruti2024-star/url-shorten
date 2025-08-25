import React, { useState } from "react";
import axios from "axios";
import { Button, Form, InputGroup } from "react-bootstrap";

function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://url-shorten-ptfc.onrender.com", {
        originalUrl: url,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">URL Shortener</h2>
      <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
        <InputGroup style={{ maxWidth: "600px" }}>
          <Form.Control
            type="text"
            placeholder="Enter your URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button type="submit" variant="primary">
            Shorten
          </Button>
        </InputGroup>
      </Form>

      {shortUrl && (
        <div className="mt-4 text-center">
          <h5>
            Shortened URL:{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </h5>
          <Button className="mt-2" variant="success" onClick={copyToClipboard}>
            Copy URL
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;

