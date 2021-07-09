<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/danielsason112/waf">
    <img src="https://image.flaticon.com/icons/png/512/1273/1273994.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Protective Edge</h3>

  <p align="center">
    Containers based Web Application Firewall
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#software-design">Sofware Design</a>
      <ul>
        <li><a href="#architecture">Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li><li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image16.png?raw=true" alt="Logo" width="600">
</p>

This project describes a web application firewall designated to identify and block attacks on websites and web applications. The system is designed to answer cyber security risks in web servers, and prevent business and image related damage, or sensitive information leaks and other dangers related to cyber attacks. The system contains three subsystems, it is container based (docker) and supports running on Linux operating systems. The three subsystems are a client-side system responsible for transferring all communication, analysis system which is responsible for identifying attacks and a management system. In this project, the client-side, working as a reverse-proxy, and the management system, allowing system deployment and status updates, were developed. As the analysis system is not a part of this project, a mock-system was developed in order to execute operations that require integration with the analysis system.
 
The client-side system is a reverse-proxy server, accepting all communication intended for the client’s server. This course of action is a primary defence circle, as all requests are intended for the proxy, which leaves the server’s address hidden. The system allows working on blocking mode - malicious requests will be blocked, or not-blocking mode - transferring all the communication and monitoring the requests. After receiving a request, the proxy sends the request for analysis and waits for the results. In case the analysis passes the request, or while working in not-blocking mode, the proxy will forward the request to the server and will wait for response. Malicious requests will be blocked if it has been set to do so. The server’s response will be forwarded back to the request sender. Furthermore, a “rules” module exists, allowing to manipulate the server’s response, like adding or editing http headers. The system also contains a fail-safe mechanism, triggered on connection loss from the analysis system. It will deploy a local analysis system, and forward the requests waiting for analysis. The client-side is container based, so fast deployment is available, and no environment setup or installations are required.

The Management system allows users to execute actions or to receive updates on the system’s status, and is responsible for managing users, authenticating users using tokens, and users permissions enforcement. The management system allows adding new client servers, and configuring them. For existing servers, it is possible to deploy client-side and analysis systems, or “kill” running deployment. The system receives reports on requests that were identified as malicious, and saves them. Malicious reports status is available in order to monitor the server. The system has a web user interface that can be used in any browser.

The analysis system job as mentioned, is to analyze http requests and classifying them as innocents or malicious. Implementation of the analysis system is not in this project scope, and in order to use other parts of the system that requires integration, a mock-system has been developed. The mock-system receives requests for analysis, and every pre-defined number of requests it sends a malicious request analysis results, and reports the management system. This mock-server can be run as a container.

All communication between the subsystems are implemented with a cross-platform external library called gRPC which gives flexibility in sending messages between client and server and is easy to use. NodeJS, a Javascript runtime environment, was chosen to be used for client-side and management systems implementation, after taking under consideration that NodeJS is a designated platform for web applications development, and is suitable for writing asynchronous code. Also, the client-side is not extensively using the CPU or running many I/O operations, as single-threaded server will allow many concurrent connections without overloading the memory, and so reaching better performance then a multi-threaded server when there are many concurrent connections.

### Built With

Major platforms and frameworks used in this project:
* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [JQuery](https://jquery.com)
* [gRPC](https://grpc.io/)
* [MongoDB](https://www.mongodb.com/)
* [Docker](https://www.docker.com/)


<!-- SOFTWARE DESIGN -->
## Software Design

### Architecture

The System contains three subsystems:
1. Client-Side - Container based <strong>Reverse Proxy</strong>
2. Core - Container Based <strong>Analysis System</strong>
3. Managment - <strong>Web Application</strong> for managing services.

<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image2.png?raw=true" alt="Logo" width="600">
</p>

## Getting Started

### Prerequisites

1. Ubuntu 18.04
2. Node.js V10
3. MongoDB 4.2
4. Docker Engine 19.09.9
5. Git

### Installation

1. Clone the repo or download the source code.
2. Open the terminal at '/management' an run:
```
npm install
node index.js
```
3. create an admin user in the db.



<!-- USAGE EXAMPLES -->
## Usage

Open the browser at [http://localhost:5000](http://localhost:5000) and sign in.

Click New Project and fill in your web app details (you can use [WebGoat 8.0](https://github.com/WebGoat/WebGoat)):
<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image32.png?raw=true" alt="Logo" width="600">
</p>

Choose the created project in the Project page:
<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image16.png?raw=true" alt="Logo" width="600">
</p>

Click Deploy:
<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image39.png?raw=true" alt="Logo" width="600">
</p>

To stop the service click Kill:
<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image35.png?raw=true" alt="Logo" width="600">
</p>

Any found threads and blocked requests will appear in the Messages page:
<p>
    <img src="https://github.com/danielsason112/waf/blob/master/images/image3.png?raw=true" alt="Logo" width="600">
</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Daniel Sason - danielsason112@gmail.com

Project Link: [https://github.com/danielsason112/waf/](https://github.com/danielsason112/waf/)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Font Awesome](https://fontawesome.com)
<div>Icons made by <a href="https://www.flaticon.com/authors/pause08" title="Pause08">Pause08</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/daniel-sasson-836447127/
[product-screenshot]: https://github.com/danielsason112/waf/blob/master/images/image16.png?raw=true
