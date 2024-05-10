import Card from 'react-bootstrap/Card';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Link } from 'react-router-dom'

const queryClient = new QueryClient()

interface PersonCardProps {
    index: number;
};

interface CharacterDataProps {
    person: number;
}

function PersonCard({ index }: PersonCardProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <CharacterData person={index + 1} /> 
        </QueryClientProvider>
    );
}

function CharacterData({ person }: CharacterDataProps): JSX.Element {

    // e.g. https://swapi.dev/api/people/1
    const { isLoading, error, data } = useQuery('getPerson_' + person, () =>
        fetch('https://swapi.dev/api/people/' + person).then(res =>
            res.json()
        )
    );

    if (isLoading) return (<p>Loading...</p>);

    if (error) return (<p>Error.</p>);

    // If request returns an empty response...
    if (!data.name) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>No data available for #{person}</Card.Title>
                </Card.Body>
            </Card>
        );
    }

    // Populate card with API data
    return (
            <Card style={{ width: '18rem' }} >
                <Card.Body>
                    <Card.Title>{data.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{data.height + ' cm, ' + data.mass + ' kg'}</Card.Subtitle>
                    <Card.Text>
                        {data.name} has {data.eye_color} eyes, {data.hair_color} hair, and a {data.skin_color} skintone.
                    </Card.Text>
                    <Card.Link href={'https://en.wikipedia.org/wiki/' + data.name.replace(/ /g, "_")}>Wikipedia</Card.Link>
                </Card.Body>
            </Card>
    );
}

export default PersonCard;