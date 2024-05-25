import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';

interface PersonCardProps {
    index: number;
    isFavorite: boolean;
    onFavoriteToggle: (cardIndex: number) => void;
}

interface CharacterData {
    id: number;
    name: string;
    height: string;
    mass: string;
    eye_color: string;
    hair_color: string;
    skin_color: string;
}

const addPerson = async (id: number, data: CharacterData): Promise<CharacterData> => {
    data.id = id;
    const response = await fetch(`https://w5c9dy2dg4.execute-api.us-east-2.amazonaws.com/people`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const deletePerson = async (id: number): Promise<void> => {
    const response = await fetch(`https://w5c9dy2dg4.execute-api.us-east-2.amazonaws.com/people/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

function PersonCard({ index, isFavorite, onFavoriteToggle }: PersonCardProps): JSX.Element {
    const queryClient = useQueryClient();
    // api starts at 1 not 0
    const person = index + 1;

    const { isLoading, error, data } = useQuery<CharacterData>('getPerson_' + person, () =>
        fetch('https://swapi.dev/api/people/' + person).then(res =>
            res.json()
        )
    );

    const addMutation = useMutation((newData: CharacterData) => addPerson(index, newData), {
        onSuccess: () => {
            queryClient.invalidateQueries('getPerson_' + person);
        },
    });

    const deleteMutation = useMutation(() => deletePerson(index), {
        onSuccess: () => {
            queryClient.invalidateQueries('getPerson_' + person);
        },
    });

    if (isLoading) return (<p>Loading...</p>);

    if (error) return (<p>Error fetching data.</p>);

    if (!data?.name) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>No data available for #{person}</Card.Title>
                </Card.Body>
            </Card>
        );
    }

    const handleFavoriteClick = () => {
        if (isFavorite) {
            deleteMutation.mutate();
        } else {
            addMutation.mutate(data);
        }
        onFavoriteToggle(index);
    };

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <ToggleButton
                    id={"favorite-btn-" + person}
                    variant={isFavorite ? 'primary' : 'outline-primary'}
                    value={1}
                    onClick={handleFavoriteClick}
                    disabled={addMutation.isLoading || deleteMutation.isLoading}
                >
                    {isFavorite ? 'Unfavorite' : 'Favorite'}
                </ToggleButton>
                <Card.Title>{data.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {data.height} cm, {data.mass} kg
                </Card.Subtitle>
                <Card.Text>
                    {data.name} has {data.eye_color} eyes, {data.hair_color} hair, and a {data.skin_color} skintone.
                </Card.Text>
                <Card.Link href={'https://en.wikipedia.org/wiki/' + data.name.replace(/ /g, "_")}>
                    Wikipedia
                </Card.Link>
            </Card.Body>
        </Card>
    );
}

export default PersonCard;
