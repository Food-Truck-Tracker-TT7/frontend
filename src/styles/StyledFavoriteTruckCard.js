import styled from 'styled-components';

const StyledFavoriteTruckCard = styled.div`
  border: 0.1rem solid ${props => props.theme.accentColor};
  width: 30%;
  a {
    color: ${props => props.theme.textColor};
    text-decoration: none;
  }
  img {
    width: 75%;
  }
  button {
    background-color: ${props => props.theme.CTAColor};
    color: ${props => props.theme.accentColor};
  }
`;

export default StyledFavoriteTruckCard;
