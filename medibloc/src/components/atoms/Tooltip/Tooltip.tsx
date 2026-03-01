import styled from 'styled-components';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

const Tooltip = () => {
  return (
    <StyledWrapper>
      <ul className="example-2">
        <li className="icon-content">
          <a
            data-social="whatsapp"
            aria-label="Whatsapp"
            href="https://api.whatsapp.com/send?phone=+112067101079&text=Save%20this%20to%20your%20Favorites%20-%20@wilsondesouza"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="filled" />
            <FaWhatsapp aria-hidden="true" />
          </a>
          <div className="tooltip">Whatsapp</div>
        </li>
        <li className="icon-content">
          <a
            data-social="facebook"
            aria-label="Facebook"
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="filled" />
            <FaFacebookF aria-hidden="true" />
          </a>
          <div className="tooltip">Facebook</div>
        </li>
        <li className="icon-content">
          <a
            data-social="instagram"
            aria-label="Instagram"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="filled" />
            <FaInstagram aria-hidden="true" />
          </a>
          <div className="tooltip">Instagram</div>
        </li>
        <li className="icon-content">
          <a
            data-social="linkedin"
            aria-label="LinkedIn"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="filled" />
            <FaLinkedinIn aria-hidden="true" />
          </a>
          <div className="tooltip">LinkedIn</div>
        </li>
      </ul>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ul {
    list-style: none;
  }

  .example-2 {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    padding: 8px 0;
  }
  .example-2 .icon-content {
    position: relative;
  }
  .example-2 .icon-content .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    opacity: 0;
    visibility: hidden;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  .example-2 .icon-content:hover .tooltip {
    opacity: 1;
    visibility: visible;
    top: -50px;
  }
  .example-2 .icon-content a {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    color: #4d4d4d;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
  .example-2 .icon-content a:hover {
    box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%);
  }
  .example-2 .icon-content a svg {
    position: relative;
    z-index: 1;
    width: 26px;
    height: 26px;
  }
  .example-2 .icon-content a:hover {
    color: white;
  }
  .example-2 .icon-content a .filled {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: all 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover .filled {
    height: 100%;
  }

  .example-2 .icon-content a[data-social='whatsapp'] .filled,
  .example-2 .icon-content a[data-social='whatsapp'] ~ .tooltip {
    background-color: #128c7e;
  }

  .example-2 .icon-content a[data-social='facebook'] .filled,
  .example-2 .icon-content a[data-social='facebook'] ~ .tooltip {
    background-color: #3b5998;
  }
  .example-2 .icon-content a[data-social='instagram'] .filled,
  .example-2 .icon-content a[data-social='instagram'] ~ .tooltip {
    background: linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #c135b4, #e1306c, #fd1f1f);
  }
  .example-2 .icon-content a[data-social='linkedin'] .filled,
  .example-2 .icon-content a[data-social='linkedin'] ~ .tooltip {
    background-color: #0077b5;
  }
`;

export default Tooltip;