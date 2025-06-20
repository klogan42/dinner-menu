import React, { useEffect, useState } from 'react';

const Menu = () => {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/menu'); // Adjust the URL based on your backend setup
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMenu(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Dinner Menu</h1>
            <ul>
                {Object.entries(menu).map(([date, meal]) => (
                    <li key={date}>
                        {date}: {meal}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;