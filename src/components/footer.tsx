import React from "react";
import styled from 'styled-components';
import MediaQuery from 'react-responsive'

const MainFooter = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Oswald");
  font-family: 'Oswald';
  background-color: #212529;
  color: rgba(255, 255, 255, 0.55);
  padding-top: 2vh;
  position: fixed;
  bottom: 0;
  padding-bottom: 2vh;
  width: 100%;
`;

const MainFooterMobile = styled.div`
  font-size: 2.5rem;
`;

function Footer() {
  return (
    <div>
      <MediaQuery maxWidth={1000}>
        <MainFooter>
          <MainFooterMobile>
            <div className="container">
              &copy;2022 Author Justinas Globys IFF-9/8
            </div>
          </MainFooterMobile>
        </MainFooter>
      </MediaQuery>

      <MediaQuery minWidth={1000}>
        <MainFooter>
          <div className="container">
            &copy;2022 Author Justinas Globys IFF-9/8
          </div>
        </MainFooter>
      </MediaQuery>
    </div>
  );
}

export default Footer;