interface PersonViewProps {
    name: string,
    height: number,
    mass: number,
    eye_color: string,
    hair_color: string,
    skin_color: string
}

function PersonView({ name, height, mass, eye_color, hair_color, skin_color }: PersonViewProps) {
    return (
        <div className="PersonView">
            <h2 className="Person-Name">{ name }</h2>
            <ul>
                <li>height: { height }</li>
                <li>mass: { mass }</li>
                <li>eye_color: { eye_color }</li>
                <li>hair_color: { hair_color }</li>
                <li>skin_color: { skin_color }</li>
            </ul>
        </div>
    )
}

export default PersonView;