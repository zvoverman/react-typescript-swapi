import { useQuery } from 'react-query';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';

interface PersonCardProps {
    index: number;
    isFavorite: boolean;
    onFavoriteToggle: (cardIndex: number) => void;
}

interface CharacterData {
    name: string;
    height: string;
    mass: string;
    eye_color: string;
    hair_color: string;
    skin_color: string;
}

function PersonCard({ index, isFavorite, onFavoriteToggle }: PersonCardProps): JSX.Element {

    // api starts at 1 not 0
    const person = index+1;

    const { isLoading, error, data } = useQuery<CharacterData>('getPerson_' + person, () =>
        fetch('https://swapi.dev/api/people/' + person).then(res => 
            res.json()
        )
    );

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
