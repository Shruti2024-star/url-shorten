import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

function AdminPanel() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    axios.get("https://url-shorten-ptfc.onrender.com")
      .then(res => setUrls(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Panel</h2>
      {urls.length === 0 ? (
        <p className="text-center">No URLs found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Clicks</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td>{url.originalUrl}</td>
                <td>
                  <a
                    href={`http://localhost:5000/${url.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`http://localhost:5000/${url.shortCode}`}
                  </a>
                </td>
                <td>{url.clicks}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `http://localhost:5000/${url.shortCode}`
                      );
                      alert("Copied!");
                    }}
                  >
                    Copy
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default AdminPanel;
