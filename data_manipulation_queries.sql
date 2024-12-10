-- CRUD

-- Create
    -- Create a car
    INSERT INTO cars (fk_engineID, model, year_released, fk_manuID)
    VALUES
    (:engineID_from_dropdown_inp,
    :model_name_chosen, :year_released_chosen, 
    :manuID_from_dropdown_input)
    -- Create a person
    INSERT INTO people(name, networth)
    VALUES
    (:name_chosen, :networth_chosen)
    -- Create a manufacturer
    INSERT INTO manufacturers (name, headquarter_location, year_established)
    VALUES
    (:name_chosen, :hq_location_chosen, :year_established_chosen)
    -- Create an engine
    INSERT INTO engines (displacement, cylinder, year_released, fk_manuID)
    VALUES
    (:displacement_chosen, :cylinder_chosen, :year_released_choesn, :manuID_from_dropdown_input)
    -- Create a people_have_cars entry (from the Person screen)
    INSERT INTO people_have_cars (fk_personID, fk_autoID)
    VALUES
    (SELECT people.personID FROM people WHERE people.name = :name_of_person_created
    , :id_of_car_to_add_to_person)

-- Read
    -- Get all of a car's information
        -- Single car (and a link to its engine)
        SELECT cars.model, cars.year_released, manufacturers.name, engines.displacement, engines.cylinder
        FROM cars
        JOIN manufacturers on cars.fk_manuID = manufacturers.manuID
        JOIN engines on cars.fk_engineID = engines.engineID
        WHERE cars.autoID = :autoID_being_viewed
        -- List view
        SELECT autoID, model AS Model, year_released AS YearReleased,manufacturers.name AS Manufacturer, fk_engineID AS EngineID
        FROM cars
        JOIN manufacturers on cars.fk_manuID = manufacturers.manuID
        ORDER BY cars.model;


    -- Get all of a person's information
        --Single persons data EXCLUDING car collection
        SELECT people.name, people.networth
        FROM people
        WHERE people.personID = :personID_that_is_being_queried;
        -- Single persons car collection. Use ALONGSIDE the first query for non car info
        SELECT people.name, cars.model, cars.year_released, manufacturers.name AS manufacturer_name, engines.engineID
        FROM cars
        JOIN people_have_cars on cars.autoID = people_have_cars.fk_autoID
        JOIN people on people_have_cars.fk_personID = people.personID AND people.personID =  :personID_that_is_being_queried 
        JOIN engines on cars.fk_engineID = engines.engineID
        JOIN manufacturers on cars.fk_manuID = manufacturers.manuID;

        -- (List of) PEOPLE PAGE (Not a singular person)
        SELECT people.name, people.networth, COUNT(people_have_cars.fk_personID) AS total_cars
        FROM people
        LEFT JOIN people_have_cars on people.personID = people_have_cars.fk_personID AND people_have_cars.fk_personID
        GROUP BY people.name
        ORDER BY people.networth ASC;

    -- Get a manufacturer's information
        -- Single manufacturer View ->
        -- Single manufacturer...
        SELECT manufacturers.name, manufacturers.headquarter_location, manufacturers.year_established, COUNT(cars.autoID) as car_count
        FROM manufacturers
        JOIN cars on manufacturers.manuID = cars.fk_manuID
        WHERE manuID = :manuID_that_is_being_queried;
        -- and its cars
        SELECT cars.model, cars.year_released
        FROM cars
        WHERE fk_manuID = :manuID_that_is_being_queried;
        -- + engines
        SELECT displacement, cylinder, year_released
        FROM engines
        WHERE fk_manuID = :manuID_that_is_being_queried;

        -- (List of) Manufacturers Page
        -- get all manufacturers and their stats
        SELECT name, headquarter_location, year_established
        FROM manufacturers
        ORDER BY name;

    -- Get all of an engine's information
        -- Single engine
        SELECT engine.engineID, manufacturers.name, engines.displacement, engines.cylinder, engines.year_released
        FROM engines
        JOIN manufacturers on engines.fk_manuID = manufacturers.manuID
        WHERE engines.engineID = :engineID_being_viewed
        -- List View
        SELECT engineID, displacement, cylinder, year_released, manufacturers.name AS manufacturer_name
        FROM engines
        JOIN manufacturers on engines.fk_manuID = manufacturers.manuID;

    -- Get all of people_have_cars data (All from people_have_cars, plus person name and car model)
        SELECT people_have_cars.intersectionID as relationshipID, people.name , people.personID, cars.model, cars.autoID
        FROM people_have_cars
        JOIN people on people_have_cars.fk_personID = people.personID
        JOIN cars on people_have_cars.fk_autoID = cars.autoID
        GROUP BY intersectionID;

-- Update
    -- PERSON
        -- Update name of person
        UPDATE people SET people.name = :new_name WHERE people.personID = :id_of_person_to_be_updated;
        -- Update networth of person
        UPDATE people SET people.networth = :new_networth WHERE people.personID = :id_of_person_to_be_updated;
    -- MANUFACTURER
        -- Update name of manufacturer
        UPDATE manufacturer SET manufacturers.name = :new_manufacturer_name WHERE manufacturer.manuID = :id_of_manu_to_be_updated;
        -- Update headquarter location
        UPDATE manufacturer SET manufacturers.headquarter_location = :new_manufacturer_hq_location WHERE manufacturer.manuID = :id_of_manu_to_be_updated;
        -- Update year established
        UPDATE manufacturer SET manufacturers.year_established = :new_manufacturer_year_est WHERE manufacturer.manuID = :id_of_manu_to_be_updated;
    -- CARS
        -- Update car
        UPDATE cars 
        SET
        cars.model = :new_cars_model_name,
        cars.year_released = :new_cars_year,
        cars.fk_manuID = :new_cars_manuID,
        cars.fk_engineID = :new_cars_engineID        
        WHERE cars.autoID = :id_of_car_to_be_updated;
    -- ENGINES
        -- Update displacement of engine
        UPDATE engines SET engines.displacement = :new_engine_displacement WHERE engines.engineID = :id_of_engine_to_be_updated
        -- Update cylinder of engine
        UPDATE engines SET engines.cylinder = :new_engine_cylinder_count WHERE engines.engineID = :id_of_engine_to_be_updated
    -- PEOPLE_HAVE_CARS
        -- Update fk_personID and fk_autoID, based on intersectionID
            --TODO
            UPDATE people_have_cars SET fk_personID = :new_fk_personID WHERE people_have_cars.intersectionID = :id_of_person_to_update;
            UPDATE people_have_cars SET fk_autoID = :new_fk_autoID WHERE people_have_cars.intersectionID = :id_of_person_to_update;
        -- Get Current intersections for a person (to check for duplicates before creating/updating)
            SELECT people_have_cars.intersectionID, people.personID, cars.autoID
            FROM people_have_cars
            JOIN people on people_have_cars.fk_personID = people.personID
            JOIN cars on people_have_cars.fk_autoID = cars.autoID
            WHERE people.personID = :id_of_person_to_check
            ORDER BY cars.autoID;

-- Delete
    DELETE FROM `cars` WHERE autoID = :autoID_of_car_to_be_deleted;
    DELETE FROM `people` WHERE personID = :personID_of_person_to_be_deleted;
    DELETE FROM `manufacturers` WHERE manuID = :manuID_of_manufacturer_to_be_deleted;
    DELETE FROM `engines` WHERE engineID = :engineID_of_engine_to_be_deleted; 
    DELETE FROM `people_have_cars` WHERE intersectionID = :intersectionID_to_be_deleted; 




-- Misc. Stuff to populate dropdowns

-- List of Engines. Needed for a car editing dropdown
SELECT engineID, displacement, cylinder, year_released ,name from engines JOIN manufacturers on engines.fk_manuID = manufacturers.manuID;

-- List of Cars. Needed for People editing dropdown
SELECT autoID, concat(model,' ', year_released) as name
FROM cars;

-- List of Manufacturers. Needed for engine & car editing drop down
SELECT name
From manufacturers;

-- Populating tables for people_have_cars html
SELECT people.personID, people.name FROM people;
SELECT cars.autoID, cars.model FROM cars;