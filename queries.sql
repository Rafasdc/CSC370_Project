-- 8.a. all posts by account A sorted by rating (descending)
SELECT title as "8.a. posts by testuser", total_rating, text
FROM (
	SELECT title, SUM(rating) as "total_rating", text
	FROM posts JOIN post_ratings ON (posts.id = post_ratings.post)
		JOIN accounts ON (posts.poster = accounts.username)
	WHERE accounts.username = "testuser"
) AS ratings
ORDER BY total_rating DESC;

-- 8.b. all posts from account A's friends, sorted by rating (descending)
SELECT title as "8.b. posts by testuser's friends", friend, total_rating, text
FROM (
	SELECT title, poster, SUM(IFNULL(rating, 0)) as "total_rating", text
	FROM posts LEFT JOIN post_ratings ON (posts.id = post_ratings.post)
	GROUP BY title
) AS ratings JOIN (
	SELECT account2 AS "friend"
	FROM friends
	WHERE account1 < account2 AND account1 = "testuser"
) AS testusers_friends ON (ratings.poster = testusers_friends.friend)
ORDER BY total_rating DESC;

-- 8.c. account A's subscribed subsaiddits (including default subsaiddits)
SELECT subsaiddits.title as "8.c. testuser's subscribed subsaiddits"
FROM accounts
	JOIN subscriptions ON (username = account)
	JOIN subsaiddits ON (subsaiddit = title)
WHERE accounts.username = "testuser"
UNION 
SELECT title
FROM subscriptions JOIN subsaiddits ON(subsaiddit = title)
WHERE is_default = 1;

-- 8.d. account A's favourite posts
SELECT title as "8.d. testuser's favourite posts"
FROM accounts
	JOIN favourites ON(accounts.username = favourites.account)
	JOIN posts ON(favourites.post = posts.id)
WHERE username = "testuser";

-- 8.e. account A's friend's favourite posts
SELECT title as "8.e. testuser's friends favourite posts", friend, text
FROM favourites
	JOIN posts ON (favourites.post = posts.id)
	JOIN (
		SELECT account2 AS "friend"
		FROM friends
		WHERE account1 < account2 AND account1 = "testuser"
	) AS testusers_friends ON (favourites.account = friend);

-- 8.f. account A's friend's subscribed subsaiddits (no duplicates)
SELECT subsaiddit as "8.f. testuser's friends subscribed subsaiddits", friend
FROM subscriptions JOIN (
	SELECT account2 AS "friend"
	FROM friends
	WHERE account1 < account2 AND account1 = "testuser"
) AS testusers_friends ON (subscriptions.account = friend);

-- 8.g. subsaiddit S's creator's posts
SELECT posts.title AS "8.g. /s/Front's creator's posts", creator
FROM subsaiddits
	JOIN accounts ON (subsaiddits.creator = accounts.username)
	JOIN posts ON (posts.poster = accounts.username)
WHERE username = "testuser"
AND subsaiddits.title = "Front";

-- 8.h. posts in subsaiddit S that contain <some text> (basic search)
SELECT posts.title AS "8.h. posts in /s/Front that contain 'my first'", text
FROM subsaiddits JOIN posts ON (posts.subsaiddit = subsaiddits.title)
WHERE subsaiddits.title = "Front"
AND posts.text LIKE "%my first%";