// styles.ts
import styled from 'styled-components';

export const StyledMenu = {
  Inner: styled.div`
    color: white;
    padding: 1.25rem; /* Corresponds to p-5 */
  `,
  Header: styled.div`
    padding-top: 1.25rem; /* Corresponds to py-5 */
    padding-bottom: 1.25rem;
  `,
  Icon: styled.div`
    padding-top: 0.25rem; /* Corresponds to py-1 */
    padding-bottom: 0.25rem;
    display: flex;
    justify-content: flex-start; /* Corresponds to justify-start */
    justify-items: flex-start; /* Corresponds to justify-items-start */
  `,
  Title: styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Corresponds to ellipsis */
    margin-left: 0.5rem; /* Corresponds to ml-2 */
  `,
  Order: styled.div`
    position: fixed;
    top: 0.5rem; /* Corresponds to top-2 */
    right: 0.5rem; /* Corresponds to right-2 */
  `,
};

export const StyledMobileMenu = {
  Inner: styled.div`
    color: white;

    padding: 1.25rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #001529;
  `,
  IconContainer: styled.div`
    display: flex;
    justify-content: space-around; /* Adjust as needed */
    align-items: center;
  `,
  IconItem: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    & svg {
      margin-bottom: 0.25rem;
    }
  `,
  Title: styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.5rem;
    display: block;
    text-align: center;
  `,
};
