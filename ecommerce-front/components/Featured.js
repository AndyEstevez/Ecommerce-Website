import styled from "styled-components";
import Center from "./Center";
import PrimaryBtn from "./PrimaryBtn";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;  
    font-weight: normal;
`;

const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 40px;
    img{
        max-width: 100%;
    }
`;

const Column = styled.div`
    display: flex;
    align-items: center;
`;

export default function Featured() {
    return (
        <Bg>
            <Center>
                <Wrapper>
                    <Column>
                        <div>
                            <Title>Pro anywhere</Title>
                            <Desc>Lorem ipsum dolor sit amet</Desc>
                            <button>Read more</button>
                            <PrimaryBtn size="l">Add to cart</PrimaryBtn>
                        </div>
                    </Column>
                    <Column>
                        <img src="https://s3.amazonaws.com/criterion-production/films/cc8cd8479b144ec5e7f2579d894b0a23/LUEgfTixxhH81fg1DgLkP5JdPosAPh_large.jpg"/>
                    </Column>
                </Wrapper>
            </Center>
        </Bg>
    )
}