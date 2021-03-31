INSERT INTO users (name, email, password) 
VALUES ('Jacqueline','jlee4332@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Sunny', 'sunny@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jane', 'jane@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,parking_spaces, number_of_bathrooms,number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Speed Lamp', 'description', 'thumbnail_url', 'cover_url', 200, 2,3,4,'USA', 'My Stweet', 'My Citay', 'Ontario', 'L2RE3S'),
(3, 'Beauty Queen', 'description', 'thumbnail_url', 'cover_url', 500, 9,10,3,'Canada', '123 streets', 'Toronto', 'Ontario', 'J23FWO'),
(2, 'Da Shack', 'description', 'thumbnail_url', 'cover_url', 1000, 3,4,5,'Canada', '23432 streets', 'Toronto', 'Ontario', 'J23FWO');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3), 
('2018-04-21', '2018-09-27', 4, 2),
('2019-02-11', '2019-02-13', 2, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (2,3,7,5,'message'),
(3,2,8,2,'message'),
(2,3,9,4,'message');