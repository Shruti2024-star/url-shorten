import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

function AdminPanel() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    axios.get("https://url-shorten-ptfc.onrender.com/api/urls")
      .then(res => setUrls(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Panel</h2>
      {urls.length === 0 ? (
        <p className="text-center">No URLs found.</p>
      ) : (
      <div className="table-responsive">
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
                    href={`https://url-shorten-ptfc.onrender.com/${url.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {`https://url-shorten-ptfc.onrender.com/${url.shortCode}`}
                  </a>
                </td>
                <td>{url.clicks}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://url-shorten-ptfc.onrender.com/${url.shortCode}`
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
      </div>
      )}
    </div>
  );
}

export default AdminPanel;
