# SafeWorks

<a name="readme-top"></a>
[![Contributors][contributors-shield]][contributors-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Safe-Works/SafeWorks/">
    <img src="https://raw.githubusercontent.com/Safe-Works/SafeWorks/main/public/img/SafeWorks_Logo_Round.png" alt="Logo" width="150" height="150">
  </a>

  <p align="center">
    <br />
    <a href="https://safe-works.azurewebsites.net/">View Demo</a> .
    <a href=https://github.com/Safe-Works/SafeWorks/blob/main/public/docs/SafeWorks_Pitch.pdf>Pitch Presentation</a> .
    <a href=https://github.com/Safe-Works/SafeWorks/blob/main/public/docs/BSI-Especifica%C3%A7%C3%A3o%20do%20Projeto%20-%20Template%20para%20entrega.docx.pdf>Specification Docs</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

SafeWorks is a project designed and developed by three Bachelors degree students in Information Systems from the Pontifical Catholic University of Paraná. </br>
The idea for the platform was thought of during the Requirements Engineering discipline, and the development of the web application was later refined and put into practice in course final paper. </br>
SafeWorks is a platform that seeks to connect informal self-employed workers and clients. It has several features aiming to at facility the advertisement, contracting and payment of services provided by self-employed workers.

Some key features:
* Service announcement in the platform
* Service search by categorys and address
* Workers reputations
* Service contract generation
* Workers and clients contract's history
* Integrated payment system
* Payment refund
* Complaints management by plataform admin
* Data analytics dashboard

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This is the main technologies used on SafeWorks web application.

Backend
* [![Typescript][Typescript.org]][Typescript-url]
* [![Node][Node.org]][Node-url]
* [![Express][Express.com]][Express-url]
* [![Firebase][Firebase.google]][Firebase-url]
* [![Swagger][Swagger.org]][Swagger-url]

Frontend

* [![Angular][Angular.io]][Angular-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![ChartJS][ChartJS.org]][ChartJS-url]

Devops

* [![Azure][Azure.com]][Azure-url]
* [![Vercel][Vercel.com]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

The repository is divided into two directories, `client` contains the entire frontend and `server` contains the entire backend. </br>
The following instructions detail in a step-by-step how you can run the complete project locally.

### Prerequisites

To run the project you must have installed and configured Node.Js and NPM. </br>
If you have questions about how to install, please follow the official guide provided by the Node.Js and NPM documentation:

* Node.Js
  <pre>
    <a href="https://nodejs.org/en/download/">https://nodejs.org/en/download/</a>
  </pre>

* NPM
  <pre>
    <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">https://docs.npmjs.com/downloading-and-installing-node-js-and-npm</a>
  </pre>

To run the Angular frontend, you must have installed the Angular CLI. </br>
If you have questions about how to install and use Angular CLI, please follow the official guide bellow:

* Angular CLI
  <pre>
    <a href="https://angular.io/cli">https://angular.io/cli</a>
  </pre>

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Safe-Works/SafeWorks.git
   ```
2. Install NPM packages on client

   ```sh
   cd client
   npm install
   ```

3. Install NPM packages on server
   ```sh
   cd server
   npm install
   ```

4. Create a .env file inside server root. Inside the .env, you must configure the connection with your Firebase and SMTP email provider. Follow these example:
   ```sh
   PORT = 3001
   FIREBASE_API_KEY = ""
   FIREBASE_ADMIN_KEY = {""}
   FIREBASE_STORAGE_BUCKET = ""
   EMAIL_SERVICE=""
   EMAIL_USER=""
   EMAIL_PASSWORD=""
   ```

5. Run client
   ```sh
   cd client
   ng serve
   ```

6. Run server
   ```sh
   cd server
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Lucas Kusman Leal - [@lucaskleal222](https://www.linkedin.com/in/lucaskleal222/) - lucaskleal222@outlook.com
</br>

Tiago Felipe Muller - [@tiagofelipemuller](https://www.linkedin.com/in/tiago-muller-b685711a7/) - tiagofelipemuller@gmail.com
</br>

Vitor Felix de Araujo - [@vitorfelixaraujo](https://www.linkedin.com/in/vitor-felix-de-araujo/) - vitorfelix37@gmail.com

Project Link: [https://github.com/Safe-Works/SafeWorks](https://github.com/Safe-Works/SafeWorks)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [View Project Demo Website](https://safe-works.azurewebsites.net/)
* [Project Public Docs and Images](https://github.com/Safe-Works/SafeWorks/tree/main/public)
* [Pontifical Catholic University of Paraná Website](https://www.pucpr.br/)
* [Information Systems Bachelor's](https://www.pucpr.br/cursos-graduacao/sistemas-de-informacao/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Safe-Works/SafeWorks.svg?style=for-the-badge
[contributors-url]: https://github.com/Safe-Works/SafeWorks/graphs/contributors

[license-shield]: https://img.shields.io/github/license/Safe-Works/SafeWorks.svg?style=for-the-badge
[license-url]: https://github.com/Safe-Works/SafeWorks/blob/master/LICENSE.txt

[Typescript.org]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/

[Node.org]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/

[Express.com]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/

[Firebase.google]: https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase
[Firebase-url]: https://firebase.google.com/

[Swagger.org]: https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white
[Swagger-url]: https://swagger.io/

[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com

[ChartJS.org]: https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white
[ChartJS-url]: https://www.chartjs.org/

[Azure.com]: https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white
[Azure-url]: https://azure.microsoft.com/

[Vercel.com]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/