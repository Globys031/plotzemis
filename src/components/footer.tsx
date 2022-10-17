import React from "react";
import styled from 'styled-components';

const MainFooter = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Oswald");
  font-family: 'Oswald';
  background-color: #212529;
  color: rgba(255, 255, 255, 0.55);
  padding-top: 2vh;
  position: relative;
  bottom: 0;
  padding-bottom: 2vh;
  width: 100%;
`;

function Footer() {
  return (
    <div>
    <MainFooter>
      <div className="container">
        &copy;2022 Author Justinas Globys IFF-9/8
      </div>
    </MainFooter>
    </div>
  );
}

export default Footer;