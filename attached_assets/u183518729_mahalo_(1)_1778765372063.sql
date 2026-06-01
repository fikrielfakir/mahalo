-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 14, 2026 at 01:29 PM
-- Server version: 11.8.6-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u183518729_mahalo`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `country` varchar(120) DEFAULT NULL,
  `state` varchar(120) DEFAULT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_default` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `country`, `state`, `slug`, `state_id`, `country_id`, `order`, `image`, `image_url`, `description`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Paris', NULL, NULL, 'paris', 1, 1, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'Lyon', NULL, NULL, 'lyon', 1, 1, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'Marseille', NULL, NULL, 'marseille', 1, 1, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'London', NULL, NULL, 'london', 2, 2, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Manchester', NULL, NULL, 'manchester', 2, 2, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(6, 'New York City', NULL, NULL, 'new-york-city', 3, 3, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(7, 'Buffalo', NULL, NULL, 'buffalo', 3, 3, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(8, 'Amsterdam', NULL, NULL, 'amsterdam', 4, 4, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(9, 'Rotterdam', NULL, NULL, 'rotterdam', 4, 4, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(10, 'Copenhagen', NULL, NULL, 'copenhagen', 5, 5, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(11, 'Aarhus', NULL, NULL, 'aarhus', 5, 5, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(12, 'Munich', NULL, NULL, 'munich', 6, 6, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(13, 'Nuremberg', NULL, NULL, 'nuremberg', 6, 6, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(14, 'Tokyo', NULL, NULL, 'tokyo-city', 7, 7, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(15, 'Osaka', NULL, NULL, 'osaka', 7, 7, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(16, 'Toronto', NULL, NULL, 'toronto', 8, 8, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(17, 'Ottawa', NULL, NULL, 'ottawa', 8, 8, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(18, 'Hamilton', NULL, NULL, 'hamilton', 8, 8, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(19, 'Sydney', NULL, NULL, 'sydney', 9, 9, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(20, 'Newcastle', NULL, NULL, 'newcastle', 9, 9, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(21, 'Wollongong', NULL, NULL, 'wollongong', 9, 9, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(22, 'Milan', NULL, NULL, 'milan', 10, 10, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(23, 'Brescia', NULL, NULL, 'brescia', 10, 10, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(24, 'Bergamo', NULL, NULL, 'bergamo', 10, 10, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(25, 'Bordeaux', NULL, NULL, 'bordeaux', 1, 1, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(26, 'Liverpool', NULL, NULL, 'liverpool', 2, 2, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(27, 'Vancouver', NULL, NULL, 'vancouver', 8, 8, 0, NULL, NULL, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `nationality` varchar(120) DEFAULT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_default` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `code`, `nationality`, `order`, `image`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(1, 'France', 'FR', 'French', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'England', 'GB', 'British', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'United States', 'US', 'American', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'Netherlands', 'NL', 'Dutch', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Denmark', 'DK', 'Danish', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(6, 'Germany', 'DE', 'German', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(7, 'Japan', 'JP', 'Japanese', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(8, 'Canada', 'CA', 'Canadian', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(9, 'Australia', 'AU', 'Australian', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(10, 'Italy', 'IT', 'Italian', 0, NULL, 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `property_id`, `created_at`, `updated_at`) VALUES
(2, 2, 3, '2026-05-13 20:21:34', '2026-05-13 20:21:34'),
(3, 2, 11, '2026-05-13 20:23:39', '2026-05-13 20:23:39');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_files`
--

CREATE TABLE `media_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `path` varchar(500) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `collection` varchar(60) NOT NULL DEFAULT 'media',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_files`
--

INSERT INTO `media_files` (`id`, `file_name`, `original_name`, `path`, `url`, `mime_type`, `size`, `collection`, `created_at`, `updated_at`) VALUES
(1, '25068ac7-1c1a-425b-a3dc-421df089eeb0.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/25068ac7-1c1a-425b-a3dc-421df089eeb0.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/25068ac7-1c1a-425b-a3dc-421df089eeb0.png', 'image/png', 2476956, 'media', '2026-05-13 18:27:32', '2026-05-13 18:27:32'),
(2, '73500b52-3978-4613-8b70-3c2dc75fdc50.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/73500b52-3978-4613-8b70-3c2dc75fdc50.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/73500b52-3978-4613-8b70-3c2dc75fdc50.png', 'image/png', 2476956, 'media', '2026-05-13 18:52:59', '2026-05-13 18:52:59'),
(3, 'e651117f-6c1e-40de-b9d3-30178c1f8bdd.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/e651117f-6c1e-40de-b9d3-30178c1f8bdd.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/e651117f-6c1e-40de-b9d3-30178c1f8bdd.png', 'image/png', 2476956, 'media', '2026-05-13 18:54:36', '2026-05-13 18:54:36'),
(4, 'b53c87c2-6cc2-4f6b-b9b4-20e19c47f453.png', 'imilchil-2.png', 'properties/b53c87c2-6cc2-4f6b-b9b4-20e19c47f453.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/b53c87c2-6cc2-4f6b-b9b4-20e19c47f453.png', 'image/png', 763852, 'properties', '2026-05-13 19:15:57', '2026-05-13 19:15:57'),
(5, 'b0ab61c1-aa1e-431a-922b-1c446fe85131.jpg', '1V2A0517-scaled.jpg', 'properties/b0ab61c1-aa1e-431a-922b-1c446fe85131.jpg', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/b0ab61c1-aa1e-431a-922b-1c446fe85131.jpg', 'image/jpeg', 225696, 'properties', '2026-05-13 19:16:07', '2026-05-13 19:16:07'),
(6, '346bf4bc-e610-4909-ad17-2b3677f6234e.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/346bf4bc-e610-4909-ad17-2b3677f6234e.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/346bf4bc-e610-4909-ad17-2b3677f6234e.png', 'image/png', 2476956, 'media', '2026-05-13 19:23:56', '2026-05-13 19:23:56'),
(7, '496e2714-fd75-4642-8a9b-006b57faa640.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/496e2714-fd75-4642-8a9b-006b57faa640.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/496e2714-fd75-4642-8a9b-006b57faa640.png', 'image/png', 2476956, 'media', '2026-05-13 19:24:37', '2026-05-13 19:24:37'),
(8, '989a2728-f71a-4ce9-9664-454efa5360c7.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/989a2728-f71a-4ce9-9664-454efa5360c7.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/989a2728-f71a-4ce9-9664-454efa5360c7.png', 'image/png', 2476956, 'properties', '2026-05-13 19:44:44', '2026-05-13 19:44:44'),
(9, 'fbb75bbd-b787-431b-a45e-9d2b8a326d85.jpg', '95914728-66940518.jpg', 'properties/fbb75bbd-b787-431b-a45e-9d2b8a326d85.jpg', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/fbb75bbd-b787-431b-a45e-9d2b8a326d85.jpg', 'image/jpeg', 127751, 'properties', '2026-05-13 19:44:57', '2026-05-13 19:44:57'),
(10, 'bb965b9f-3b62-40a8-88db-81c8fb813d55.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/bb965b9f-3b62-40a8-88db-81c8fb813d55.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/bb965b9f-3b62-40a8-88db-81c8fb813d55.png', 'image/png', 2476956, 'properties', '2026-05-13 19:46:58', '2026-05-13 19:46:58'),
(11, '7e003028-4a6c-4102-9ee2-c9fc38e0b4ee.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/7e003028-4a6c-4102-9ee2-c9fc38e0b4ee.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/7e003028-4a6c-4102-9ee2-c9fc38e0b4ee.png', 'image/png', 2476956, 'media', '2026-05-13 19:48:06', '2026-05-13 19:48:06'),
(12, '9236fe12-a0de-4046-a2b5-d27956218d38.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/9236fe12-a0de-4046-a2b5-d27956218d38.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/9236fe12-a0de-4046-a2b5-d27956218d38.png', 'image/png', 2476956, 'properties', '2026-05-13 20:01:00', '2026-05-13 20:01:00'),
(13, '2c9b2b85-e397-4406-a009-a6e36a635da8.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/2c9b2b85-e397-4406-a009-a6e36a635da8.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/2c9b2b85-e397-4406-a009-a6e36a635da8.png', 'image/png', 2355148, 'properties', '2026-05-13 20:09:22', '2026-05-13 20:09:22'),
(14, '36962715-eecb-4e0e-b7ab-dd5717788fbd.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/36962715-eecb-4e0e-b7ab-dd5717788fbd.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/36962715-eecb-4e0e-b7ab-dd5717788fbd.png', 'image/png', 2345472, 'properties', '2026-05-13 20:25:03', '2026-05-13 20:25:03'),
(15, '9ac886f9-bcd4-4fd7-aa89-822fe5e4e1d6.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'properties/9ac886f9-bcd4-4fd7-aa89-822fe5e4e1d6.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/properties/9ac886f9-bcd4-4fd7-aa89-822fe5e4e1d6.png', 'image/png', 2344385, 'properties', '2026-05-13 20:25:38', '2026-05-13 20:25:38'),
(16, 'e1e49725-4a10-4869-af8d-3e920535ca3a.png', 'ChatGPT Image May 13, 2026, 03_28_20 PM.png', 'media/e1e49725-4a10-4869-af8d-3e920535ca3a.png', 'https://blueviolet-newt-360669.hostingersite.com/storage/media/e1e49725-4a10-4869-af8d-3e920535ca3a.png', 'image/png', 2344385, 'media', '2026-05-14 10:52:48', '2026-05-14 10:52:48');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '2014_10_12_000000_create_users_table', 1),
(3, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(4, '2019_01_05_053554_create_jobs_table', 1),
(5, '2019_08_19_000000_create_failed_jobs_table', 1),
(6, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(7, '2024_07_03_162029_remove_plugin_team', 1),
(8, '2024_09_30_024515_create_sessions_table', 1),
(9, '2025_01_01_000001_create_real_estate_tables', 1),
(10, '2025_01_01_000002_create_seed_data', 1),
(11, '2025_06_01_000001_cms_enhancements', 2),
(12, '2026_05_13_115303_add_phone_to_users_table', 3),
(13, '2026_05_13_121021_add_profile_fields_to_users_table', 4),
(14, '2026_05_13_201537_create_favorites_table', 5),
(15, '2026_05_14_000001_add_google_id_to_users_table', 6),
(16, '2026_05_14_100001_add_professional_application_to_users_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 1, 'api-token', 'ffb4f02d6a34713926033d0de6245aafad1b0373a4f95a361fbbaebcb80b93cb', '[\"*\"]', '2026-05-13 13:02:17', NULL, '2026-05-13 10:14:20', '2026-05-13 13:02:17'),
(3, 'App\\Models\\User', 1, 'api-token', 'fd5f029bbccc564f6ee90362dcebcdb77b8eda83655815c8a141419200e3dd49', '[\"*\"]', '2026-05-13 17:56:55', NULL, '2026-05-13 17:37:54', '2026-05-13 17:56:55'),
(4, 'App\\Models\\User', 1, 'api-token', '53234fe881b7e36d88a6b39bf516a032d3f8b63807ef1ca1bd7d2b81df1b05a4', '[\"*\"]', '2026-05-13 18:04:26', NULL, '2026-05-13 17:44:45', '2026-05-13 18:04:26'),
(5, 'App\\Models\\User', 1, 'api-token', '4d723549bb15e7b60a13b205b4db4f6739870f3f3904e18e161ef1778ea03e78', '[\"*\"]', '2026-05-13 20:25:42', NULL, '2026-05-13 18:07:44', '2026-05-13 20:25:42'),
(7, 'App\\Models\\User', 2, 'api-token', '911e36a16b857515fb8978348620a9494c2edcdf2ba8b02a55bdd668609be747', '[\"*\"]', '2026-05-13 20:27:31', NULL, '2026-05-13 19:24:08', '2026-05-13 20:27:31'),
(9, 'App\\Models\\User', 1, 'api-token', 'fd9a06af129fd75cdbd1f4f34df36cc8d3ff8eaec56f13cee4e18787e448627b', '[\"*\"]', '2026-05-14 11:05:38', NULL, '2026-05-14 10:09:03', '2026-05-14 11:05:38'),
(10, 'App\\Models\\User', 2, 'api-token', 'f40f86f9ecb805f62873e45481bce72295ad1e5cae86790f1ec8f86ca04888cd', '[\"*\"]', '2026-05-14 10:53:08', NULL, '2026-05-14 10:52:34', '2026-05-14 10:53:08'),
(11, 'App\\Models\\User', 1, 'api-token', '37e0a73e6ef0066264cc3be026afac0df66a92e88dca357d903bc71c803e1393', '[\"*\"]', '2026-05-14 13:27:29', NULL, '2026-05-14 11:32:38', '2026-05-14 13:27:29'),
(12, 'App\\Models\\User', 5, 'api-token', 'fabaacf7f3b8d976b5448da1f012c96698a82e51eee85c16ef65ee0a2145be0d', '[\"*\"]', '2026-05-14 12:10:20', NULL, '2026-05-14 11:45:05', '2026-05-14 12:10:20'),
(13, 'App\\Models\\User', 6, 'api-token', '0e8c53ee08ac74c8a554761b298376df5683aa4fa0b1a9de11416454587be7c0', '[\"*\"]', '2026-05-14 13:27:29', NULL, '2026-05-14 12:11:13', '2026-05-14 13:27:29');

-- --------------------------------------------------------

--
-- Table structure for table `re_accounts`
--

CREATE TABLE `re_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(120) NOT NULL,
  `last_name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(60) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_id` bigint(20) UNSIGNED DEFAULT NULL,
  `phone` varchar(25) DEFAULT NULL,
  `whatsapp` varchar(25) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `verified_at` timestamp NULL DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `credits` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `package_started_at` timestamp NULL DEFAULT NULL,
  `package_ended_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_accounts`
--

INSERT INTO `re_accounts` (`id`, `first_name`, `last_name`, `description`, `gender`, `email`, `username`, `password`, `avatar_id`, `phone`, `whatsapp`, `is_featured`, `is_verified`, `verified_at`, `city_id`, `credits`, `package_id`, `package_started_at`, `package_ended_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Sarah', 'Johnson', NULL, NULL, 'sarah.johnson@homzen.ma', 'sarahjohnson', '$2y$12$RWIZ2xJESRsrDAo3w8LyZ.azvcIz2SAE7sINKTrIwuhEv.efFaKqy', NULL, '+212 612 345 001', NULL, 1, 1, '2026-05-12 19:43:38', 6, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'Michael', 'Chen', NULL, NULL, 'michael.chen@homzen.ma', 'michaelchen', '$2y$12$9qWlmyLu551zquB/Pyb4UOi0.hp8QF/BOD48ThJkfQz4H5Rte0bDG', NULL, '+212 612 345 002', NULL, 1, 1, '2026-05-12 19:43:38', 4, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'Emma', 'Williams', NULL, NULL, 'emma.williams@homzen.ma', 'emmawilliams', '$2y$12$xdWAAzgYQnaMpArAsoTal.ZutNpvAiJ3uqReGS0kofzt6croLSKKa', NULL, '+212 612 345 003', NULL, 1, 1, '2026-05-12 19:43:39', 1, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:39', '2026-05-12 19:43:39'),
(4, 'James', 'Brown', NULL, NULL, 'james.brown@homzen.ma', 'jamesbrown', '$2y$12$5ulGc9NYAt59sGMrICQg4.n9kW9M5GcegSq.VWaCJBwzQU39tEuy6', NULL, '+212 612 345 004', NULL, 1, 1, '2026-05-12 19:43:39', 8, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:39', '2026-05-12 19:43:39'),
(5, 'Olivia', 'Taylor', NULL, NULL, 'olivia.taylor@homzen.ma', 'oliviataylor', '$2y$12$9.y66lQVRat54zopYZ07s.XCwPzEnXG5z3Kz5FxNL1QH3.WHiq1gq', NULL, '+212 612 345 005', NULL, 0, 1, '2026-05-12 19:43:39', 12, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:39', '2026-05-12 19:43:39'),
(6, 'William', 'Martinez', NULL, NULL, 'william.martinez@homzen.ma', 'williammartinez', '$2y$12$0366N0CVOqLbi76DJ9Pzyu1HLqwkOFT2wg5mRhI2j8foDBV0OdaBW', NULL, '+212 612 345 006', NULL, 0, 1, '2026-05-12 19:43:39', 22, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:39', '2026-05-12 19:43:39'),
(7, 'Sophia', 'Anderson', NULL, NULL, 'sophia.anderson@homzen.ma', 'sophiaanderson', '$2y$12$ye74UfU0pJWP9sDrGNP9teXvvEkgkn5WU7QC3IsWzSTwqdi0xzRm6', NULL, '+212 612 345 007', NULL, 0, 1, '2026-05-12 19:43:39', 14, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:39', '2026-05-12 19:43:39'),
(8, 'Liam', 'Garcia', NULL, NULL, 'liam.garcia@homzen.ma', 'liamgarcia', '$2y$12$vrtezvaDC9bRwpsmE7xD4uy4D6TGZifti4MQk3Pk.wA6/Qjuo9c96', NULL, '+212 612 345 008', NULL, 0, 1, '2026-05-12 19:43:40', 16, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(9, 'Ava', 'Rodriguez', NULL, NULL, 'ava.rodriguez@homzen.ma', 'avarodriguez', '$2y$12$MdcqKCI1JnIWq28O74aJC.FPYmANrTq4W4UGMs9U9q44H5oufxKDu', NULL, '+212 612 345 009', NULL, 0, 1, '2026-05-12 19:43:40', 19, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(10, 'Noah', 'Wilson', NULL, NULL, 'noah.wilson@homzen.ma', 'noahwilson', '$2y$12$VfTKT0QEEvC121lgq0QBIeGlSiohEnprkgeCvgSbF3z83FZQpu8nS', NULL, '+212 612 345 010', NULL, 0, 1, '2026-05-12 19:43:40', 10, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(11, 'Isabella', 'Lee', NULL, NULL, 'isabella.lee@homzen.ma', 'isabellalee', '$2y$12$Q2N.t767xKhZHblpuJZqV.cgdiqa7dCpQCb8nVjY.JLWmvJgfoJWW', NULL, '+212 612 345 011', NULL, 0, 1, '2026-05-12 19:43:40', 3, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(12, 'Oliver', 'Nguyen', NULL, NULL, 'oliver.nguyen@homzen.ma', 'olivernguyen', '$2y$12$AQVKExyYJ5mO39woL.ktIeRtEBAGwj.l5EvA9G/1I5smwBJ83MpWS', NULL, '+212 612 345 012', NULL, 0, 1, '2026-05-12 19:43:40', 6, 0, NULL, NULL, NULL, NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40');

-- --------------------------------------------------------

--
-- Table structure for table `re_categories`
--

CREATE TABLE `re_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_default` tinyint(4) NOT NULL DEFAULT 0,
  `parent_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_categories`
--

INSERT INTO `re_categories` (`id`, `name`, `description`, `content`, `status`, `order`, `is_default`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Apartment', NULL, NULL, 'published', 1, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'Villa', NULL, NULL, 'published', 2, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'Condo', NULL, NULL, 'published', 3, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'House', NULL, NULL, 'published', 4, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Land', NULL, NULL, 'published', 5, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(6, 'Commercial Property', NULL, NULL, 'published', 6, 0, 0, '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `re_consults`
--

CREATE TABLE `re_consults` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(39) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `custom_fields` text DEFAULT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_consults`
--

INSERT INTO `re_consults` (`id`, `name`, `email`, `phone`, `project_id`, `property_id`, `ip_address`, `content`, `custom_fields`, `status`, `created_at`, `updated_at`) VALUES
(1, 'fikri', 'elfakirfikri@gmail.com', '0696126701', NULL, NULL, '105.154.103.195', NULL, NULL, 'unread', '2026-05-13 17:44:21', '2026-05-13 17:44:21'),
(2, 'FIKRI EL FAKIR', 'elfakirfikri@gmail.com', '0696126701', NULL, NULL, '105.154.103.195', NULL, NULL, 'unread', '2026-05-13 18:53:15', '2026-05-13 18:53:15'),
(3, 'FIKRI EL FAKIR', 'elfakirfikri@gmail.com', '0696126701', NULL, NULL, '105.154.103.195', NULL, NULL, 'unread', '2026-05-13 18:54:37', '2026-05-13 18:54:37');

-- --------------------------------------------------------

--
-- Table structure for table `re_currencies`
--

CREATE TABLE `re_currencies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(120) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `is_prefix_symbol` tinyint(1) NOT NULL DEFAULT 1,
  `decimals` varchar(10) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `order` varchar(10) DEFAULT NULL,
  `exchange_rate` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_currencies`
--

INSERT INTO `re_currencies` (`id`, `title`, `symbol`, `is_prefix_symbol`, `decimals`, `is_default`, `order`, `exchange_rate`, `created_at`, `updated_at`) VALUES
(1, 'MAD', 'MAD', 0, '0', 1, '0', '1', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'USD', '$', 1, '2', 0, '1', '0.1', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'EUR', '€', 0, '2', 0, '2', '0.092', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `re_facilities`
--

CREATE TABLE `re_facilities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `icon` varchar(60) DEFAULT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_facilities`
--

INSERT INTO `re_facilities` (`id`, `name`, `icon`, `status`, `created_at`, `updated_at`) VALUES
(1, 'School', 'ti ti-school', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'Market', 'ti ti-building-store', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'Medical Center', 'ti ti-medical-cross', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'Restaurant', 'ti ti-tools-kitchen-2', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Gym', 'ti ti-barbell', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(6, 'Pharmacy', 'ti ti-pill', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(7, 'Bank', 'ti ti-building-bank', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(8, 'Bus Stop', 'ti ti-bus', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(9, 'Airport', 'ti ti-plane', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(10, 'Shopping Mall', 'ti ti-building', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(11, 'Public Park', 'ti ti-trees', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `re_facilities_distances`
--

CREATE TABLE `re_facilities_distances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference_id` bigint(20) UNSIGNED NOT NULL,
  `reference_type` varchar(255) NOT NULL,
  `facility_id` bigint(20) UNSIGNED NOT NULL,
  `distance` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_facilities_distances`
--

INSERT INTO `re_facilities_distances` (`id`, `reference_id`, `reference_type`, `facility_id`, `distance`) VALUES
(1, 1, 'Botble\\RealEstate\\Models\\Project', 1, '4km'),
(2, 1, 'Botble\\RealEstate\\Models\\Project', 2, '1km'),
(3, 1, 'Botble\\RealEstate\\Models\\Project', 3, '4km'),
(4, 1, 'Botble\\RealEstate\\Models\\Project', 4, '1km'),
(5, 1, 'Botble\\RealEstate\\Models\\Project', 5, '9km'),
(6, 1, 'Botble\\RealEstate\\Models\\Project', 6, '7km'),
(7, 1, 'Botble\\RealEstate\\Models\\Project', 7, '8km'),
(8, 1, 'Botble\\RealEstate\\Models\\Project', 8, '5km'),
(9, 1, 'Botble\\RealEstate\\Models\\Project', 9, '20km'),
(10, 1, 'Botble\\RealEstate\\Models\\Project', 10, '6km'),
(11, 1, 'Botble\\RealEstate\\Models\\Project', 11, '11km'),
(12, 2, 'Botble\\RealEstate\\Models\\Project', 1, '19km'),
(13, 2, 'Botble\\RealEstate\\Models\\Project', 2, '14km'),
(14, 2, 'Botble\\RealEstate\\Models\\Project', 3, '1km'),
(15, 2, 'Botble\\RealEstate\\Models\\Project', 4, '19km'),
(16, 2, 'Botble\\RealEstate\\Models\\Project', 5, '18km'),
(17, 2, 'Botble\\RealEstate\\Models\\Project', 6, '16km'),
(18, 2, 'Botble\\RealEstate\\Models\\Project', 7, '10km'),
(19, 2, 'Botble\\RealEstate\\Models\\Project', 8, '2km'),
(20, 2, 'Botble\\RealEstate\\Models\\Project', 9, '18km'),
(21, 2, 'Botble\\RealEstate\\Models\\Project', 10, '2km'),
(22, 2, 'Botble\\RealEstate\\Models\\Project', 11, '20km'),
(23, 3, 'Botble\\RealEstate\\Models\\Project', 1, '2km'),
(24, 3, 'Botble\\RealEstate\\Models\\Project', 2, '10km'),
(25, 3, 'Botble\\RealEstate\\Models\\Project', 3, '9km'),
(26, 3, 'Botble\\RealEstate\\Models\\Project', 4, '18km'),
(27, 3, 'Botble\\RealEstate\\Models\\Project', 5, '16km'),
(28, 3, 'Botble\\RealEstate\\Models\\Project', 6, '20km'),
(29, 3, 'Botble\\RealEstate\\Models\\Project', 7, '18km'),
(30, 3, 'Botble\\RealEstate\\Models\\Project', 8, '16km'),
(31, 3, 'Botble\\RealEstate\\Models\\Project', 9, '14km'),
(32, 3, 'Botble\\RealEstate\\Models\\Project', 10, '14km'),
(33, 3, 'Botble\\RealEstate\\Models\\Project', 11, '16km'),
(34, 4, 'Botble\\RealEstate\\Models\\Project', 1, '7km'),
(35, 4, 'Botble\\RealEstate\\Models\\Project', 2, '14km'),
(36, 4, 'Botble\\RealEstate\\Models\\Project', 3, '17km'),
(37, 4, 'Botble\\RealEstate\\Models\\Project', 4, '2km'),
(38, 4, 'Botble\\RealEstate\\Models\\Project', 5, '8km'),
(39, 4, 'Botble\\RealEstate\\Models\\Project', 6, '13km'),
(40, 4, 'Botble\\RealEstate\\Models\\Project', 7, '17km'),
(41, 4, 'Botble\\RealEstate\\Models\\Project', 8, '20km'),
(42, 4, 'Botble\\RealEstate\\Models\\Project', 9, '6km'),
(43, 4, 'Botble\\RealEstate\\Models\\Project', 10, '2km'),
(44, 4, 'Botble\\RealEstate\\Models\\Project', 11, '16km'),
(45, 5, 'Botble\\RealEstate\\Models\\Project', 1, '19km'),
(46, 5, 'Botble\\RealEstate\\Models\\Project', 2, '6km'),
(47, 5, 'Botble\\RealEstate\\Models\\Project', 3, '12km'),
(48, 5, 'Botble\\RealEstate\\Models\\Project', 4, '16km'),
(49, 5, 'Botble\\RealEstate\\Models\\Project', 5, '5km'),
(50, 5, 'Botble\\RealEstate\\Models\\Project', 6, '3km'),
(51, 5, 'Botble\\RealEstate\\Models\\Project', 7, '5km'),
(52, 5, 'Botble\\RealEstate\\Models\\Project', 8, '18km'),
(53, 5, 'Botble\\RealEstate\\Models\\Project', 9, '17km'),
(54, 5, 'Botble\\RealEstate\\Models\\Project', 10, '5km'),
(55, 5, 'Botble\\RealEstate\\Models\\Project', 11, '11km'),
(56, 6, 'Botble\\RealEstate\\Models\\Project', 1, '9km'),
(57, 6, 'Botble\\RealEstate\\Models\\Project', 2, '20km'),
(58, 6, 'Botble\\RealEstate\\Models\\Project', 3, '10km'),
(59, 6, 'Botble\\RealEstate\\Models\\Project', 4, '11km'),
(60, 6, 'Botble\\RealEstate\\Models\\Project', 5, '5km'),
(61, 6, 'Botble\\RealEstate\\Models\\Project', 6, '16km'),
(62, 6, 'Botble\\RealEstate\\Models\\Project', 7, '20km'),
(63, 6, 'Botble\\RealEstate\\Models\\Project', 8, '15km'),
(64, 6, 'Botble\\RealEstate\\Models\\Project', 9, '16km'),
(65, 6, 'Botble\\RealEstate\\Models\\Project', 10, '19km'),
(66, 6, 'Botble\\RealEstate\\Models\\Project', 11, '1km'),
(67, 7, 'Botble\\RealEstate\\Models\\Project', 1, '8km'),
(68, 7, 'Botble\\RealEstate\\Models\\Project', 2, '16km'),
(69, 7, 'Botble\\RealEstate\\Models\\Project', 3, '7km'),
(70, 7, 'Botble\\RealEstate\\Models\\Project', 4, '15km'),
(71, 7, 'Botble\\RealEstate\\Models\\Project', 5, '13km'),
(72, 7, 'Botble\\RealEstate\\Models\\Project', 6, '12km'),
(73, 7, 'Botble\\RealEstate\\Models\\Project', 7, '8km'),
(74, 7, 'Botble\\RealEstate\\Models\\Project', 8, '14km'),
(75, 7, 'Botble\\RealEstate\\Models\\Project', 9, '10km'),
(76, 7, 'Botble\\RealEstate\\Models\\Project', 10, '11km'),
(77, 7, 'Botble\\RealEstate\\Models\\Project', 11, '10km'),
(78, 8, 'Botble\\RealEstate\\Models\\Project', 1, '13km'),
(79, 8, 'Botble\\RealEstate\\Models\\Project', 2, '11km'),
(80, 8, 'Botble\\RealEstate\\Models\\Project', 3, '2km'),
(81, 8, 'Botble\\RealEstate\\Models\\Project', 4, '13km'),
(82, 8, 'Botble\\RealEstate\\Models\\Project', 5, '20km'),
(83, 8, 'Botble\\RealEstate\\Models\\Project', 6, '17km'),
(84, 8, 'Botble\\RealEstate\\Models\\Project', 7, '3km'),
(85, 8, 'Botble\\RealEstate\\Models\\Project', 8, '8km'),
(86, 8, 'Botble\\RealEstate\\Models\\Project', 9, '20km'),
(87, 8, 'Botble\\RealEstate\\Models\\Project', 10, '3km'),
(88, 8, 'Botble\\RealEstate\\Models\\Project', 11, '8km'),
(89, 9, 'Botble\\RealEstate\\Models\\Project', 1, '11km'),
(90, 9, 'Botble\\RealEstate\\Models\\Project', 2, '1km'),
(91, 9, 'Botble\\RealEstate\\Models\\Project', 3, '5km'),
(92, 9, 'Botble\\RealEstate\\Models\\Project', 4, '13km'),
(93, 9, 'Botble\\RealEstate\\Models\\Project', 5, '10km'),
(94, 9, 'Botble\\RealEstate\\Models\\Project', 6, '13km'),
(95, 9, 'Botble\\RealEstate\\Models\\Project', 7, '10km'),
(96, 9, 'Botble\\RealEstate\\Models\\Project', 8, '15km'),
(97, 9, 'Botble\\RealEstate\\Models\\Project', 9, '20km'),
(98, 9, 'Botble\\RealEstate\\Models\\Project', 10, '4km'),
(99, 9, 'Botble\\RealEstate\\Models\\Project', 11, '6km'),
(100, 10, 'Botble\\RealEstate\\Models\\Project', 1, '8km'),
(101, 10, 'Botble\\RealEstate\\Models\\Project', 2, '2km'),
(102, 10, 'Botble\\RealEstate\\Models\\Project', 3, '1km'),
(103, 10, 'Botble\\RealEstate\\Models\\Project', 4, '19km'),
(104, 10, 'Botble\\RealEstate\\Models\\Project', 5, '4km'),
(105, 10, 'Botble\\RealEstate\\Models\\Project', 6, '7km'),
(106, 10, 'Botble\\RealEstate\\Models\\Project', 7, '19km'),
(107, 10, 'Botble\\RealEstate\\Models\\Project', 8, '17km'),
(108, 10, 'Botble\\RealEstate\\Models\\Project', 9, '1km'),
(109, 10, 'Botble\\RealEstate\\Models\\Project', 10, '6km'),
(110, 10, 'Botble\\RealEstate\\Models\\Project', 11, '20km'),
(111, 11, 'Botble\\RealEstate\\Models\\Project', 1, '20km'),
(112, 11, 'Botble\\RealEstate\\Models\\Project', 2, '2km'),
(113, 11, 'Botble\\RealEstate\\Models\\Project', 3, '8km'),
(114, 11, 'Botble\\RealEstate\\Models\\Project', 4, '5km'),
(115, 11, 'Botble\\RealEstate\\Models\\Project', 5, '6km'),
(116, 11, 'Botble\\RealEstate\\Models\\Project', 6, '1km'),
(117, 11, 'Botble\\RealEstate\\Models\\Project', 7, '2km'),
(118, 11, 'Botble\\RealEstate\\Models\\Project', 8, '6km'),
(119, 11, 'Botble\\RealEstate\\Models\\Project', 9, '19km'),
(120, 11, 'Botble\\RealEstate\\Models\\Project', 10, '11km'),
(121, 11, 'Botble\\RealEstate\\Models\\Project', 11, '17km'),
(122, 12, 'Botble\\RealEstate\\Models\\Project', 1, '12km'),
(123, 12, 'Botble\\RealEstate\\Models\\Project', 2, '8km'),
(124, 12, 'Botble\\RealEstate\\Models\\Project', 3, '2km'),
(125, 12, 'Botble\\RealEstate\\Models\\Project', 4, '20km'),
(126, 12, 'Botble\\RealEstate\\Models\\Project', 5, '7km'),
(127, 12, 'Botble\\RealEstate\\Models\\Project', 6, '6km'),
(128, 12, 'Botble\\RealEstate\\Models\\Project', 7, '7km'),
(129, 12, 'Botble\\RealEstate\\Models\\Project', 8, '17km'),
(130, 12, 'Botble\\RealEstate\\Models\\Project', 9, '14km'),
(131, 12, 'Botble\\RealEstate\\Models\\Project', 10, '13km'),
(132, 12, 'Botble\\RealEstate\\Models\\Project', 11, '4km'),
(133, 13, 'Botble\\RealEstate\\Models\\Project', 1, '14km'),
(134, 13, 'Botble\\RealEstate\\Models\\Project', 2, '7km'),
(135, 13, 'Botble\\RealEstate\\Models\\Project', 3, '17km'),
(136, 13, 'Botble\\RealEstate\\Models\\Project', 4, '7km'),
(137, 13, 'Botble\\RealEstate\\Models\\Project', 5, '15km'),
(138, 13, 'Botble\\RealEstate\\Models\\Project', 6, '15km'),
(139, 13, 'Botble\\RealEstate\\Models\\Project', 7, '13km'),
(140, 13, 'Botble\\RealEstate\\Models\\Project', 8, '4km'),
(141, 13, 'Botble\\RealEstate\\Models\\Project', 9, '2km'),
(142, 13, 'Botble\\RealEstate\\Models\\Project', 10, '19km'),
(143, 13, 'Botble\\RealEstate\\Models\\Project', 11, '12km'),
(144, 14, 'Botble\\RealEstate\\Models\\Project', 1, '17km'),
(145, 14, 'Botble\\RealEstate\\Models\\Project', 2, '10km'),
(146, 14, 'Botble\\RealEstate\\Models\\Project', 3, '3km'),
(147, 14, 'Botble\\RealEstate\\Models\\Project', 4, '7km'),
(148, 14, 'Botble\\RealEstate\\Models\\Project', 5, '4km'),
(149, 14, 'Botble\\RealEstate\\Models\\Project', 6, '17km'),
(150, 14, 'Botble\\RealEstate\\Models\\Project', 7, '20km'),
(151, 14, 'Botble\\RealEstate\\Models\\Project', 8, '14km'),
(152, 14, 'Botble\\RealEstate\\Models\\Project', 9, '18km'),
(153, 14, 'Botble\\RealEstate\\Models\\Project', 10, '12km'),
(154, 14, 'Botble\\RealEstate\\Models\\Project', 11, '8km'),
(155, 15, 'Botble\\RealEstate\\Models\\Project', 1, '10km'),
(156, 15, 'Botble\\RealEstate\\Models\\Project', 2, '4km'),
(157, 15, 'Botble\\RealEstate\\Models\\Project', 3, '15km'),
(158, 15, 'Botble\\RealEstate\\Models\\Project', 4, '5km'),
(159, 15, 'Botble\\RealEstate\\Models\\Project', 5, '9km'),
(160, 15, 'Botble\\RealEstate\\Models\\Project', 6, '8km'),
(161, 15, 'Botble\\RealEstate\\Models\\Project', 7, '8km'),
(162, 15, 'Botble\\RealEstate\\Models\\Project', 8, '13km'),
(163, 15, 'Botble\\RealEstate\\Models\\Project', 9, '3km'),
(164, 15, 'Botble\\RealEstate\\Models\\Project', 10, '17km'),
(165, 15, 'Botble\\RealEstate\\Models\\Project', 11, '13km'),
(166, 16, 'Botble\\RealEstate\\Models\\Project', 1, '6km'),
(167, 16, 'Botble\\RealEstate\\Models\\Project', 2, '7km'),
(168, 16, 'Botble\\RealEstate\\Models\\Project', 3, '11km'),
(169, 16, 'Botble\\RealEstate\\Models\\Project', 4, '14km'),
(170, 16, 'Botble\\RealEstate\\Models\\Project', 5, '6km'),
(171, 16, 'Botble\\RealEstate\\Models\\Project', 6, '10km'),
(172, 16, 'Botble\\RealEstate\\Models\\Project', 7, '13km'),
(173, 16, 'Botble\\RealEstate\\Models\\Project', 8, '9km'),
(174, 16, 'Botble\\RealEstate\\Models\\Project', 9, '7km'),
(175, 16, 'Botble\\RealEstate\\Models\\Project', 10, '12km'),
(176, 16, 'Botble\\RealEstate\\Models\\Project', 11, '13km'),
(177, 17, 'Botble\\RealEstate\\Models\\Project', 1, '7km'),
(178, 17, 'Botble\\RealEstate\\Models\\Project', 2, '7km'),
(179, 17, 'Botble\\RealEstate\\Models\\Project', 3, '16km'),
(180, 17, 'Botble\\RealEstate\\Models\\Project', 4, '3km'),
(181, 17, 'Botble\\RealEstate\\Models\\Project', 5, '14km'),
(182, 17, 'Botble\\RealEstate\\Models\\Project', 6, '8km'),
(183, 17, 'Botble\\RealEstate\\Models\\Project', 7, '8km'),
(184, 17, 'Botble\\RealEstate\\Models\\Project', 8, '3km'),
(185, 17, 'Botble\\RealEstate\\Models\\Project', 9, '4km'),
(186, 17, 'Botble\\RealEstate\\Models\\Project', 10, '10km'),
(187, 17, 'Botble\\RealEstate\\Models\\Project', 11, '15km'),
(188, 18, 'Botble\\RealEstate\\Models\\Project', 1, '5km'),
(189, 18, 'Botble\\RealEstate\\Models\\Project', 2, '16km'),
(190, 18, 'Botble\\RealEstate\\Models\\Project', 3, '7km'),
(191, 18, 'Botble\\RealEstate\\Models\\Project', 4, '11km'),
(192, 18, 'Botble\\RealEstate\\Models\\Project', 5, '10km'),
(193, 18, 'Botble\\RealEstate\\Models\\Project', 6, '12km'),
(194, 18, 'Botble\\RealEstate\\Models\\Project', 7, '13km'),
(195, 18, 'Botble\\RealEstate\\Models\\Project', 8, '20km'),
(196, 18, 'Botble\\RealEstate\\Models\\Project', 9, '13km'),
(197, 18, 'Botble\\RealEstate\\Models\\Project', 10, '13km'),
(198, 18, 'Botble\\RealEstate\\Models\\Project', 11, '1km'),
(199, 1, 'Botble\\RealEstate\\Models\\Property', 1, '15km'),
(200, 1, 'Botble\\RealEstate\\Models\\Property', 2, '10km'),
(201, 1, 'Botble\\RealEstate\\Models\\Property', 3, '18km'),
(202, 1, 'Botble\\RealEstate\\Models\\Property', 4, '3km'),
(203, 1, 'Botble\\RealEstate\\Models\\Property', 5, '15km'),
(204, 1, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(205, 1, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(206, 1, 'Botble\\RealEstate\\Models\\Property', 8, '6km'),
(207, 1, 'Botble\\RealEstate\\Models\\Property', 9, '5km'),
(208, 1, 'Botble\\RealEstate\\Models\\Property', 10, '18km'),
(209, 1, 'Botble\\RealEstate\\Models\\Property', 11, '14km'),
(210, 2, 'Botble\\RealEstate\\Models\\Property', 1, '1km'),
(211, 2, 'Botble\\RealEstate\\Models\\Property', 2, '19km'),
(212, 2, 'Botble\\RealEstate\\Models\\Property', 3, '1km'),
(213, 2, 'Botble\\RealEstate\\Models\\Property', 4, '16km'),
(214, 2, 'Botble\\RealEstate\\Models\\Property', 5, '19km'),
(215, 2, 'Botble\\RealEstate\\Models\\Property', 6, '4km'),
(216, 2, 'Botble\\RealEstate\\Models\\Property', 7, '4km'),
(217, 2, 'Botble\\RealEstate\\Models\\Property', 8, '18km'),
(218, 2, 'Botble\\RealEstate\\Models\\Property', 9, '9km'),
(219, 2, 'Botble\\RealEstate\\Models\\Property', 10, '8km'),
(220, 2, 'Botble\\RealEstate\\Models\\Property', 11, '19km'),
(221, 3, 'Botble\\RealEstate\\Models\\Property', 1, '13km'),
(222, 3, 'Botble\\RealEstate\\Models\\Property', 2, '18km'),
(223, 3, 'Botble\\RealEstate\\Models\\Property', 3, '10km'),
(224, 3, 'Botble\\RealEstate\\Models\\Property', 4, '13km'),
(225, 3, 'Botble\\RealEstate\\Models\\Property', 5, '20km'),
(226, 3, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(227, 3, 'Botble\\RealEstate\\Models\\Property', 7, '20km'),
(228, 3, 'Botble\\RealEstate\\Models\\Property', 8, '14km'),
(229, 3, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(230, 3, 'Botble\\RealEstate\\Models\\Property', 10, '8km'),
(231, 3, 'Botble\\RealEstate\\Models\\Property', 11, '8km'),
(232, 4, 'Botble\\RealEstate\\Models\\Property', 1, '14km'),
(233, 4, 'Botble\\RealEstate\\Models\\Property', 2, '2km'),
(234, 4, 'Botble\\RealEstate\\Models\\Property', 3, '12km'),
(235, 4, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(236, 4, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(237, 4, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(238, 4, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(239, 4, 'Botble\\RealEstate\\Models\\Property', 8, '5km'),
(240, 4, 'Botble\\RealEstate\\Models\\Property', 9, '9km'),
(241, 4, 'Botble\\RealEstate\\Models\\Property', 10, '8km'),
(242, 4, 'Botble\\RealEstate\\Models\\Property', 11, '17km'),
(243, 5, 'Botble\\RealEstate\\Models\\Property', 1, '6km'),
(244, 5, 'Botble\\RealEstate\\Models\\Property', 2, '15km'),
(245, 5, 'Botble\\RealEstate\\Models\\Property', 3, '12km'),
(246, 5, 'Botble\\RealEstate\\Models\\Property', 4, '18km'),
(247, 5, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(248, 5, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(249, 5, 'Botble\\RealEstate\\Models\\Property', 7, '12km'),
(250, 5, 'Botble\\RealEstate\\Models\\Property', 8, '17km'),
(251, 5, 'Botble\\RealEstate\\Models\\Property', 9, '9km'),
(252, 5, 'Botble\\RealEstate\\Models\\Property', 10, '14km'),
(253, 5, 'Botble\\RealEstate\\Models\\Property', 11, '9km'),
(254, 6, 'Botble\\RealEstate\\Models\\Property', 1, '13km'),
(255, 6, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(256, 6, 'Botble\\RealEstate\\Models\\Property', 3, '14km'),
(257, 6, 'Botble\\RealEstate\\Models\\Property', 4, '19km'),
(258, 6, 'Botble\\RealEstate\\Models\\Property', 5, '19km'),
(259, 6, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(260, 6, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(261, 6, 'Botble\\RealEstate\\Models\\Property', 8, '16km'),
(262, 6, 'Botble\\RealEstate\\Models\\Property', 9, '18km'),
(263, 6, 'Botble\\RealEstate\\Models\\Property', 10, '7km'),
(264, 6, 'Botble\\RealEstate\\Models\\Property', 11, '9km'),
(265, 7, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(266, 7, 'Botble\\RealEstate\\Models\\Property', 2, '10km'),
(267, 7, 'Botble\\RealEstate\\Models\\Property', 3, '16km'),
(268, 7, 'Botble\\RealEstate\\Models\\Property', 4, '8km'),
(269, 7, 'Botble\\RealEstate\\Models\\Property', 5, '17km'),
(270, 7, 'Botble\\RealEstate\\Models\\Property', 6, '10km'),
(271, 7, 'Botble\\RealEstate\\Models\\Property', 7, '13km'),
(272, 7, 'Botble\\RealEstate\\Models\\Property', 8, '7km'),
(273, 7, 'Botble\\RealEstate\\Models\\Property', 9, '17km'),
(274, 7, 'Botble\\RealEstate\\Models\\Property', 10, '15km'),
(275, 7, 'Botble\\RealEstate\\Models\\Property', 11, '19km'),
(276, 8, 'Botble\\RealEstate\\Models\\Property', 1, '3km'),
(277, 8, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(278, 8, 'Botble\\RealEstate\\Models\\Property', 3, '11km'),
(279, 8, 'Botble\\RealEstate\\Models\\Property', 4, '17km'),
(280, 8, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(281, 8, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(282, 8, 'Botble\\RealEstate\\Models\\Property', 7, '5km'),
(283, 8, 'Botble\\RealEstate\\Models\\Property', 8, '15km'),
(284, 8, 'Botble\\RealEstate\\Models\\Property', 9, '19km'),
(285, 8, 'Botble\\RealEstate\\Models\\Property', 10, '11km'),
(286, 8, 'Botble\\RealEstate\\Models\\Property', 11, '1km'),
(287, 9, 'Botble\\RealEstate\\Models\\Property', 1, '3km'),
(288, 9, 'Botble\\RealEstate\\Models\\Property', 2, '9km'),
(289, 9, 'Botble\\RealEstate\\Models\\Property', 3, '11km'),
(290, 9, 'Botble\\RealEstate\\Models\\Property', 4, '8km'),
(291, 9, 'Botble\\RealEstate\\Models\\Property', 5, '3km'),
(292, 9, 'Botble\\RealEstate\\Models\\Property', 6, '2km'),
(293, 9, 'Botble\\RealEstate\\Models\\Property', 7, '18km'),
(294, 9, 'Botble\\RealEstate\\Models\\Property', 8, '11km'),
(295, 9, 'Botble\\RealEstate\\Models\\Property', 9, '14km'),
(296, 9, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(297, 9, 'Botble\\RealEstate\\Models\\Property', 11, '8km'),
(298, 10, 'Botble\\RealEstate\\Models\\Property', 1, '12km'),
(299, 10, 'Botble\\RealEstate\\Models\\Property', 2, '10km'),
(300, 10, 'Botble\\RealEstate\\Models\\Property', 3, '14km'),
(301, 10, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(302, 10, 'Botble\\RealEstate\\Models\\Property', 5, '9km'),
(303, 10, 'Botble\\RealEstate\\Models\\Property', 6, '16km'),
(304, 10, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(305, 10, 'Botble\\RealEstate\\Models\\Property', 8, '6km'),
(306, 10, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(307, 10, 'Botble\\RealEstate\\Models\\Property', 10, '17km'),
(308, 10, 'Botble\\RealEstate\\Models\\Property', 11, '10km'),
(309, 11, 'Botble\\RealEstate\\Models\\Property', 1, '18km'),
(310, 11, 'Botble\\RealEstate\\Models\\Property', 2, '9km'),
(311, 11, 'Botble\\RealEstate\\Models\\Property', 3, '3km'),
(312, 11, 'Botble\\RealEstate\\Models\\Property', 4, '10km'),
(313, 11, 'Botble\\RealEstate\\Models\\Property', 5, '16km'),
(314, 11, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(315, 11, 'Botble\\RealEstate\\Models\\Property', 7, '13km'),
(316, 11, 'Botble\\RealEstate\\Models\\Property', 8, '20km'),
(317, 11, 'Botble\\RealEstate\\Models\\Property', 9, '4km'),
(318, 11, 'Botble\\RealEstate\\Models\\Property', 10, '8km'),
(319, 11, 'Botble\\RealEstate\\Models\\Property', 11, '2km'),
(320, 12, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(321, 12, 'Botble\\RealEstate\\Models\\Property', 2, '13km'),
(322, 12, 'Botble\\RealEstate\\Models\\Property', 3, '16km'),
(323, 12, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(324, 12, 'Botble\\RealEstate\\Models\\Property', 5, '8km'),
(325, 12, 'Botble\\RealEstate\\Models\\Property', 6, '9km'),
(326, 12, 'Botble\\RealEstate\\Models\\Property', 7, '15km'),
(327, 12, 'Botble\\RealEstate\\Models\\Property', 8, '8km'),
(328, 12, 'Botble\\RealEstate\\Models\\Property', 9, '8km'),
(329, 12, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(330, 12, 'Botble\\RealEstate\\Models\\Property', 11, '9km'),
(331, 13, 'Botble\\RealEstate\\Models\\Property', 1, '7km'),
(332, 13, 'Botble\\RealEstate\\Models\\Property', 2, '13km'),
(333, 13, 'Botble\\RealEstate\\Models\\Property', 3, '20km'),
(334, 13, 'Botble\\RealEstate\\Models\\Property', 4, '4km'),
(335, 13, 'Botble\\RealEstate\\Models\\Property', 5, '16km'),
(336, 13, 'Botble\\RealEstate\\Models\\Property', 6, '7km'),
(337, 13, 'Botble\\RealEstate\\Models\\Property', 7, '5km'),
(338, 13, 'Botble\\RealEstate\\Models\\Property', 8, '10km'),
(339, 13, 'Botble\\RealEstate\\Models\\Property', 9, '11km'),
(340, 13, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(341, 13, 'Botble\\RealEstate\\Models\\Property', 11, '7km'),
(342, 14, 'Botble\\RealEstate\\Models\\Property', 1, '2km'),
(343, 14, 'Botble\\RealEstate\\Models\\Property', 2, '1km'),
(344, 14, 'Botble\\RealEstate\\Models\\Property', 3, '7km'),
(345, 14, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(346, 14, 'Botble\\RealEstate\\Models\\Property', 5, '6km'),
(347, 14, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(348, 14, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(349, 14, 'Botble\\RealEstate\\Models\\Property', 8, '1km'),
(350, 14, 'Botble\\RealEstate\\Models\\Property', 9, '4km'),
(351, 14, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(352, 14, 'Botble\\RealEstate\\Models\\Property', 11, '20km'),
(353, 15, 'Botble\\RealEstate\\Models\\Property', 1, '13km'),
(354, 15, 'Botble\\RealEstate\\Models\\Property', 2, '12km'),
(355, 15, 'Botble\\RealEstate\\Models\\Property', 3, '8km'),
(356, 15, 'Botble\\RealEstate\\Models\\Property', 4, '13km'),
(357, 15, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(358, 15, 'Botble\\RealEstate\\Models\\Property', 6, '10km'),
(359, 15, 'Botble\\RealEstate\\Models\\Property', 7, '8km'),
(360, 15, 'Botble\\RealEstate\\Models\\Property', 8, '17km'),
(361, 15, 'Botble\\RealEstate\\Models\\Property', 9, '8km'),
(362, 15, 'Botble\\RealEstate\\Models\\Property', 10, '19km'),
(363, 15, 'Botble\\RealEstate\\Models\\Property', 11, '4km'),
(364, 16, 'Botble\\RealEstate\\Models\\Property', 1, '6km'),
(365, 16, 'Botble\\RealEstate\\Models\\Property', 2, '5km'),
(366, 16, 'Botble\\RealEstate\\Models\\Property', 3, '3km'),
(367, 16, 'Botble\\RealEstate\\Models\\Property', 4, '20km'),
(368, 16, 'Botble\\RealEstate\\Models\\Property', 5, '4km'),
(369, 16, 'Botble\\RealEstate\\Models\\Property', 6, '4km'),
(370, 16, 'Botble\\RealEstate\\Models\\Property', 7, '12km'),
(371, 16, 'Botble\\RealEstate\\Models\\Property', 8, '9km'),
(372, 16, 'Botble\\RealEstate\\Models\\Property', 9, '7km'),
(373, 16, 'Botble\\RealEstate\\Models\\Property', 10, '16km'),
(374, 16, 'Botble\\RealEstate\\Models\\Property', 11, '15km'),
(375, 17, 'Botble\\RealEstate\\Models\\Property', 1, '2km'),
(376, 17, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(377, 17, 'Botble\\RealEstate\\Models\\Property', 3, '15km'),
(378, 17, 'Botble\\RealEstate\\Models\\Property', 4, '14km'),
(379, 17, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(380, 17, 'Botble\\RealEstate\\Models\\Property', 6, '18km'),
(381, 17, 'Botble\\RealEstate\\Models\\Property', 7, '14km'),
(382, 17, 'Botble\\RealEstate\\Models\\Property', 8, '20km'),
(383, 17, 'Botble\\RealEstate\\Models\\Property', 9, '3km'),
(384, 17, 'Botble\\RealEstate\\Models\\Property', 10, '7km'),
(385, 17, 'Botble\\RealEstate\\Models\\Property', 11, '20km'),
(386, 18, 'Botble\\RealEstate\\Models\\Property', 1, '11km'),
(387, 18, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(388, 18, 'Botble\\RealEstate\\Models\\Property', 3, '10km'),
(389, 18, 'Botble\\RealEstate\\Models\\Property', 4, '17km'),
(390, 18, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(391, 18, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(392, 18, 'Botble\\RealEstate\\Models\\Property', 7, '12km'),
(393, 18, 'Botble\\RealEstate\\Models\\Property', 8, '15km'),
(394, 18, 'Botble\\RealEstate\\Models\\Property', 9, '7km'),
(395, 18, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(396, 18, 'Botble\\RealEstate\\Models\\Property', 11, '2km'),
(397, 19, 'Botble\\RealEstate\\Models\\Property', 1, '17km'),
(398, 19, 'Botble\\RealEstate\\Models\\Property', 2, '11km'),
(399, 19, 'Botble\\RealEstate\\Models\\Property', 3, '6km'),
(400, 19, 'Botble\\RealEstate\\Models\\Property', 4, '7km'),
(401, 19, 'Botble\\RealEstate\\Models\\Property', 5, '3km'),
(402, 19, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(403, 19, 'Botble\\RealEstate\\Models\\Property', 7, '17km'),
(404, 19, 'Botble\\RealEstate\\Models\\Property', 8, '6km'),
(405, 19, 'Botble\\RealEstate\\Models\\Property', 9, '11km'),
(406, 19, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(407, 19, 'Botble\\RealEstate\\Models\\Property', 11, '3km'),
(408, 20, 'Botble\\RealEstate\\Models\\Property', 1, '7km'),
(409, 20, 'Botble\\RealEstate\\Models\\Property', 2, '14km'),
(410, 20, 'Botble\\RealEstate\\Models\\Property', 3, '5km'),
(411, 20, 'Botble\\RealEstate\\Models\\Property', 4, '3km'),
(412, 20, 'Botble\\RealEstate\\Models\\Property', 5, '20km'),
(413, 20, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(414, 20, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(415, 20, 'Botble\\RealEstate\\Models\\Property', 8, '5km'),
(416, 20, 'Botble\\RealEstate\\Models\\Property', 9, '15km'),
(417, 20, 'Botble\\RealEstate\\Models\\Property', 10, '16km'),
(418, 20, 'Botble\\RealEstate\\Models\\Property', 11, '18km'),
(419, 21, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(420, 21, 'Botble\\RealEstate\\Models\\Property', 2, '17km'),
(421, 21, 'Botble\\RealEstate\\Models\\Property', 3, '16km'),
(422, 21, 'Botble\\RealEstate\\Models\\Property', 4, '4km'),
(423, 21, 'Botble\\RealEstate\\Models\\Property', 5, '13km'),
(424, 21, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(425, 21, 'Botble\\RealEstate\\Models\\Property', 7, '8km'),
(426, 21, 'Botble\\RealEstate\\Models\\Property', 8, '2km'),
(427, 21, 'Botble\\RealEstate\\Models\\Property', 9, '6km'),
(428, 21, 'Botble\\RealEstate\\Models\\Property', 10, '16km'),
(429, 21, 'Botble\\RealEstate\\Models\\Property', 11, '13km'),
(430, 22, 'Botble\\RealEstate\\Models\\Property', 1, '1km'),
(431, 22, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(432, 22, 'Botble\\RealEstate\\Models\\Property', 3, '6km'),
(433, 22, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(434, 22, 'Botble\\RealEstate\\Models\\Property', 5, '12km'),
(435, 22, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(436, 22, 'Botble\\RealEstate\\Models\\Property', 7, '14km'),
(437, 22, 'Botble\\RealEstate\\Models\\Property', 8, '18km'),
(438, 22, 'Botble\\RealEstate\\Models\\Property', 9, '15km'),
(439, 22, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(440, 22, 'Botble\\RealEstate\\Models\\Property', 11, '2km'),
(441, 23, 'Botble\\RealEstate\\Models\\Property', 1, '18km'),
(442, 23, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(443, 23, 'Botble\\RealEstate\\Models\\Property', 3, '2km'),
(444, 23, 'Botble\\RealEstate\\Models\\Property', 4, '4km'),
(445, 23, 'Botble\\RealEstate\\Models\\Property', 5, '3km'),
(446, 23, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(447, 23, 'Botble\\RealEstate\\Models\\Property', 7, '8km'),
(448, 23, 'Botble\\RealEstate\\Models\\Property', 8, '18km'),
(449, 23, 'Botble\\RealEstate\\Models\\Property', 9, '5km'),
(450, 23, 'Botble\\RealEstate\\Models\\Property', 10, '12km'),
(451, 23, 'Botble\\RealEstate\\Models\\Property', 11, '13km'),
(452, 24, 'Botble\\RealEstate\\Models\\Property', 1, '1km'),
(453, 24, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(454, 24, 'Botble\\RealEstate\\Models\\Property', 3, '8km'),
(455, 24, 'Botble\\RealEstate\\Models\\Property', 4, '3km'),
(456, 24, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(457, 24, 'Botble\\RealEstate\\Models\\Property', 6, '10km'),
(458, 24, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(459, 24, 'Botble\\RealEstate\\Models\\Property', 8, '18km'),
(460, 24, 'Botble\\RealEstate\\Models\\Property', 9, '10km'),
(461, 24, 'Botble\\RealEstate\\Models\\Property', 10, '18km'),
(462, 24, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(463, 25, 'Botble\\RealEstate\\Models\\Property', 1, '18km'),
(464, 25, 'Botble\\RealEstate\\Models\\Property', 2, '10km'),
(465, 25, 'Botble\\RealEstate\\Models\\Property', 3, '3km'),
(466, 25, 'Botble\\RealEstate\\Models\\Property', 4, '17km'),
(467, 25, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(468, 25, 'Botble\\RealEstate\\Models\\Property', 6, '10km'),
(469, 25, 'Botble\\RealEstate\\Models\\Property', 7, '14km'),
(470, 25, 'Botble\\RealEstate\\Models\\Property', 8, '16km'),
(471, 25, 'Botble\\RealEstate\\Models\\Property', 9, '3km'),
(472, 25, 'Botble\\RealEstate\\Models\\Property', 10, '12km'),
(473, 25, 'Botble\\RealEstate\\Models\\Property', 11, '3km'),
(474, 26, 'Botble\\RealEstate\\Models\\Property', 1, '4km'),
(475, 26, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(476, 26, 'Botble\\RealEstate\\Models\\Property', 3, '14km'),
(477, 26, 'Botble\\RealEstate\\Models\\Property', 4, '5km'),
(478, 26, 'Botble\\RealEstate\\Models\\Property', 5, '8km'),
(479, 26, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(480, 26, 'Botble\\RealEstate\\Models\\Property', 7, '15km'),
(481, 26, 'Botble\\RealEstate\\Models\\Property', 8, '19km'),
(482, 26, 'Botble\\RealEstate\\Models\\Property', 9, '9km'),
(483, 26, 'Botble\\RealEstate\\Models\\Property', 10, '14km'),
(484, 26, 'Botble\\RealEstate\\Models\\Property', 11, '16km'),
(485, 27, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(486, 27, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(487, 27, 'Botble\\RealEstate\\Models\\Property', 3, '6km'),
(488, 27, 'Botble\\RealEstate\\Models\\Property', 4, '9km'),
(489, 27, 'Botble\\RealEstate\\Models\\Property', 5, '6km'),
(490, 27, 'Botble\\RealEstate\\Models\\Property', 6, '6km'),
(491, 27, 'Botble\\RealEstate\\Models\\Property', 7, '15km'),
(492, 27, 'Botble\\RealEstate\\Models\\Property', 8, '6km'),
(493, 27, 'Botble\\RealEstate\\Models\\Property', 9, '16km'),
(494, 27, 'Botble\\RealEstate\\Models\\Property', 10, '15km'),
(495, 27, 'Botble\\RealEstate\\Models\\Property', 11, '18km'),
(496, 28, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(497, 28, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(498, 28, 'Botble\\RealEstate\\Models\\Property', 3, '12km'),
(499, 28, 'Botble\\RealEstate\\Models\\Property', 4, '20km'),
(500, 28, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(501, 28, 'Botble\\RealEstate\\Models\\Property', 6, '12km'),
(502, 28, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(503, 28, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(504, 28, 'Botble\\RealEstate\\Models\\Property', 9, '5km'),
(505, 28, 'Botble\\RealEstate\\Models\\Property', 10, '2km'),
(506, 28, 'Botble\\RealEstate\\Models\\Property', 11, '19km'),
(507, 29, 'Botble\\RealEstate\\Models\\Property', 1, '4km'),
(508, 29, 'Botble\\RealEstate\\Models\\Property', 2, '16km'),
(509, 29, 'Botble\\RealEstate\\Models\\Property', 3, '18km'),
(510, 29, 'Botble\\RealEstate\\Models\\Property', 4, '7km'),
(511, 29, 'Botble\\RealEstate\\Models\\Property', 5, '8km'),
(512, 29, 'Botble\\RealEstate\\Models\\Property', 6, '18km'),
(513, 29, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(514, 29, 'Botble\\RealEstate\\Models\\Property', 8, '2km'),
(515, 29, 'Botble\\RealEstate\\Models\\Property', 9, '12km'),
(516, 29, 'Botble\\RealEstate\\Models\\Property', 10, '18km'),
(517, 29, 'Botble\\RealEstate\\Models\\Property', 11, '18km'),
(518, 30, 'Botble\\RealEstate\\Models\\Property', 1, '4km'),
(519, 30, 'Botble\\RealEstate\\Models\\Property', 2, '9km'),
(520, 30, 'Botble\\RealEstate\\Models\\Property', 3, '19km'),
(521, 30, 'Botble\\RealEstate\\Models\\Property', 4, '14km'),
(522, 30, 'Botble\\RealEstate\\Models\\Property', 5, '7km'),
(523, 30, 'Botble\\RealEstate\\Models\\Property', 6, '11km'),
(524, 30, 'Botble\\RealEstate\\Models\\Property', 7, '10km'),
(525, 30, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(526, 30, 'Botble\\RealEstate\\Models\\Property', 9, '13km'),
(527, 30, 'Botble\\RealEstate\\Models\\Property', 10, '20km'),
(528, 30, 'Botble\\RealEstate\\Models\\Property', 11, '14km'),
(529, 31, 'Botble\\RealEstate\\Models\\Property', 1, '7km'),
(530, 31, 'Botble\\RealEstate\\Models\\Property', 2, '4km'),
(531, 31, 'Botble\\RealEstate\\Models\\Property', 3, '8km'),
(532, 31, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(533, 31, 'Botble\\RealEstate\\Models\\Property', 5, '5km'),
(534, 31, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(535, 31, 'Botble\\RealEstate\\Models\\Property', 7, '13km'),
(536, 31, 'Botble\\RealEstate\\Models\\Property', 8, '20km'),
(537, 31, 'Botble\\RealEstate\\Models\\Property', 9, '16km'),
(538, 31, 'Botble\\RealEstate\\Models\\Property', 10, '5km'),
(539, 31, 'Botble\\RealEstate\\Models\\Property', 11, '10km'),
(540, 32, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(541, 32, 'Botble\\RealEstate\\Models\\Property', 2, '16km'),
(542, 32, 'Botble\\RealEstate\\Models\\Property', 3, '5km'),
(543, 32, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(544, 32, 'Botble\\RealEstate\\Models\\Property', 5, '6km'),
(545, 32, 'Botble\\RealEstate\\Models\\Property', 6, '17km'),
(546, 32, 'Botble\\RealEstate\\Models\\Property', 7, '6km'),
(547, 32, 'Botble\\RealEstate\\Models\\Property', 8, '20km'),
(548, 32, 'Botble\\RealEstate\\Models\\Property', 9, '19km'),
(549, 32, 'Botble\\RealEstate\\Models\\Property', 10, '17km'),
(550, 32, 'Botble\\RealEstate\\Models\\Property', 11, '10km'),
(551, 33, 'Botble\\RealEstate\\Models\\Property', 1, '15km'),
(552, 33, 'Botble\\RealEstate\\Models\\Property', 2, '2km'),
(553, 33, 'Botble\\RealEstate\\Models\\Property', 3, '16km'),
(554, 33, 'Botble\\RealEstate\\Models\\Property', 4, '15km'),
(555, 33, 'Botble\\RealEstate\\Models\\Property', 5, '7km'),
(556, 33, 'Botble\\RealEstate\\Models\\Property', 6, '14km'),
(557, 33, 'Botble\\RealEstate\\Models\\Property', 7, '5km'),
(558, 33, 'Botble\\RealEstate\\Models\\Property', 8, '13km'),
(559, 33, 'Botble\\RealEstate\\Models\\Property', 9, '7km'),
(560, 33, 'Botble\\RealEstate\\Models\\Property', 10, '1km'),
(561, 33, 'Botble\\RealEstate\\Models\\Property', 11, '4km'),
(562, 34, 'Botble\\RealEstate\\Models\\Property', 1, '15km'),
(563, 34, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(564, 34, 'Botble\\RealEstate\\Models\\Property', 3, '14km'),
(565, 34, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(566, 34, 'Botble\\RealEstate\\Models\\Property', 5, '9km'),
(567, 34, 'Botble\\RealEstate\\Models\\Property', 6, '7km'),
(568, 34, 'Botble\\RealEstate\\Models\\Property', 7, '12km'),
(569, 34, 'Botble\\RealEstate\\Models\\Property', 8, '3km'),
(570, 34, 'Botble\\RealEstate\\Models\\Property', 9, '12km'),
(571, 34, 'Botble\\RealEstate\\Models\\Property', 10, '5km'),
(572, 34, 'Botble\\RealEstate\\Models\\Property', 11, '8km'),
(573, 35, 'Botble\\RealEstate\\Models\\Property', 1, '14km'),
(574, 35, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(575, 35, 'Botble\\RealEstate\\Models\\Property', 3, '16km'),
(576, 35, 'Botble\\RealEstate\\Models\\Property', 4, '4km'),
(577, 35, 'Botble\\RealEstate\\Models\\Property', 5, '5km'),
(578, 35, 'Botble\\RealEstate\\Models\\Property', 6, '18km'),
(579, 35, 'Botble\\RealEstate\\Models\\Property', 7, '10km'),
(580, 35, 'Botble\\RealEstate\\Models\\Property', 8, '16km'),
(581, 35, 'Botble\\RealEstate\\Models\\Property', 9, '11km'),
(582, 35, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(583, 35, 'Botble\\RealEstate\\Models\\Property', 11, '15km'),
(584, 36, 'Botble\\RealEstate\\Models\\Property', 1, '1km'),
(585, 36, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(586, 36, 'Botble\\RealEstate\\Models\\Property', 3, '1km'),
(587, 36, 'Botble\\RealEstate\\Models\\Property', 4, '16km'),
(588, 36, 'Botble\\RealEstate\\Models\\Property', 5, '18km'),
(589, 36, 'Botble\\RealEstate\\Models\\Property', 6, '7km'),
(590, 36, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(591, 36, 'Botble\\RealEstate\\Models\\Property', 8, '13km'),
(592, 36, 'Botble\\RealEstate\\Models\\Property', 9, '8km'),
(593, 36, 'Botble\\RealEstate\\Models\\Property', 10, '7km'),
(594, 36, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(595, 37, 'Botble\\RealEstate\\Models\\Property', 1, '11km'),
(596, 37, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(597, 37, 'Botble\\RealEstate\\Models\\Property', 3, '3km'),
(598, 37, 'Botble\\RealEstate\\Models\\Property', 4, '8km'),
(599, 37, 'Botble\\RealEstate\\Models\\Property', 5, '15km'),
(600, 37, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(601, 37, 'Botble\\RealEstate\\Models\\Property', 7, '4km'),
(602, 37, 'Botble\\RealEstate\\Models\\Property', 8, '5km'),
(603, 37, 'Botble\\RealEstate\\Models\\Property', 9, '11km'),
(604, 37, 'Botble\\RealEstate\\Models\\Property', 10, '15km'),
(605, 37, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(606, 38, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(607, 38, 'Botble\\RealEstate\\Models\\Property', 2, '14km'),
(608, 38, 'Botble\\RealEstate\\Models\\Property', 3, '5km'),
(609, 38, 'Botble\\RealEstate\\Models\\Property', 4, '16km'),
(610, 38, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(611, 38, 'Botble\\RealEstate\\Models\\Property', 6, '4km'),
(612, 38, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(613, 38, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(614, 38, 'Botble\\RealEstate\\Models\\Property', 9, '20km'),
(615, 38, 'Botble\\RealEstate\\Models\\Property', 10, '9km'),
(616, 38, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(617, 39, 'Botble\\RealEstate\\Models\\Property', 1, '3km'),
(618, 39, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(619, 39, 'Botble\\RealEstate\\Models\\Property', 3, '10km'),
(620, 39, 'Botble\\RealEstate\\Models\\Property', 4, '10km'),
(621, 39, 'Botble\\RealEstate\\Models\\Property', 5, '20km'),
(622, 39, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(623, 39, 'Botble\\RealEstate\\Models\\Property', 7, '8km'),
(624, 39, 'Botble\\RealEstate\\Models\\Property', 8, '17km'),
(625, 39, 'Botble\\RealEstate\\Models\\Property', 9, '8km'),
(626, 39, 'Botble\\RealEstate\\Models\\Property', 10, '13km'),
(627, 39, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(628, 40, 'Botble\\RealEstate\\Models\\Property', 1, '12km'),
(629, 40, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(630, 40, 'Botble\\RealEstate\\Models\\Property', 3, '14km'),
(631, 40, 'Botble\\RealEstate\\Models\\Property', 4, '6km'),
(632, 40, 'Botble\\RealEstate\\Models\\Property', 5, '15km'),
(633, 40, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(634, 40, 'Botble\\RealEstate\\Models\\Property', 7, '15km'),
(635, 40, 'Botble\\RealEstate\\Models\\Property', 8, '1km'),
(636, 40, 'Botble\\RealEstate\\Models\\Property', 9, '5km'),
(637, 40, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(638, 40, 'Botble\\RealEstate\\Models\\Property', 11, '5km'),
(639, 41, 'Botble\\RealEstate\\Models\\Property', 1, '13km'),
(640, 41, 'Botble\\RealEstate\\Models\\Property', 2, '13km'),
(641, 41, 'Botble\\RealEstate\\Models\\Property', 3, '15km'),
(642, 41, 'Botble\\RealEstate\\Models\\Property', 4, '12km'),
(643, 41, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(644, 41, 'Botble\\RealEstate\\Models\\Property', 6, '19km'),
(645, 41, 'Botble\\RealEstate\\Models\\Property', 7, '6km'),
(646, 41, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(647, 41, 'Botble\\RealEstate\\Models\\Property', 9, '14km'),
(648, 41, 'Botble\\RealEstate\\Models\\Property', 10, '14km'),
(649, 41, 'Botble\\RealEstate\\Models\\Property', 11, '7km'),
(650, 42, 'Botble\\RealEstate\\Models\\Property', 1, '12km'),
(651, 42, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(652, 42, 'Botble\\RealEstate\\Models\\Property', 3, '9km'),
(653, 42, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(654, 42, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(655, 42, 'Botble\\RealEstate\\Models\\Property', 6, '4km'),
(656, 42, 'Botble\\RealEstate\\Models\\Property', 7, '13km'),
(657, 42, 'Botble\\RealEstate\\Models\\Property', 8, '9km'),
(658, 42, 'Botble\\RealEstate\\Models\\Property', 9, '10km'),
(659, 42, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(660, 42, 'Botble\\RealEstate\\Models\\Property', 11, '5km'),
(661, 43, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(662, 43, 'Botble\\RealEstate\\Models\\Property', 2, '4km'),
(663, 43, 'Botble\\RealEstate\\Models\\Property', 3, '8km'),
(664, 43, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(665, 43, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(666, 43, 'Botble\\RealEstate\\Models\\Property', 6, '19km'),
(667, 43, 'Botble\\RealEstate\\Models\\Property', 7, '16km'),
(668, 43, 'Botble\\RealEstate\\Models\\Property', 8, '6km'),
(669, 43, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(670, 43, 'Botble\\RealEstate\\Models\\Property', 10, '6km'),
(671, 43, 'Botble\\RealEstate\\Models\\Property', 11, '10km'),
(672, 44, 'Botble\\RealEstate\\Models\\Property', 1, '11km'),
(673, 44, 'Botble\\RealEstate\\Models\\Property', 2, '12km'),
(674, 44, 'Botble\\RealEstate\\Models\\Property', 3, '5km'),
(675, 44, 'Botble\\RealEstate\\Models\\Property', 4, '17km'),
(676, 44, 'Botble\\RealEstate\\Models\\Property', 5, '1km'),
(677, 44, 'Botble\\RealEstate\\Models\\Property', 6, '2km'),
(678, 44, 'Botble\\RealEstate\\Models\\Property', 7, '4km'),
(679, 44, 'Botble\\RealEstate\\Models\\Property', 8, '19km'),
(680, 44, 'Botble\\RealEstate\\Models\\Property', 9, '13km'),
(681, 44, 'Botble\\RealEstate\\Models\\Property', 10, '13km'),
(682, 44, 'Botble\\RealEstate\\Models\\Property', 11, '6km'),
(683, 45, 'Botble\\RealEstate\\Models\\Property', 1, '12km'),
(684, 45, 'Botble\\RealEstate\\Models\\Property', 2, '13km'),
(685, 45, 'Botble\\RealEstate\\Models\\Property', 3, '4km'),
(686, 45, 'Botble\\RealEstate\\Models\\Property', 4, '7km'),
(687, 45, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(688, 45, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(689, 45, 'Botble\\RealEstate\\Models\\Property', 7, '17km'),
(690, 45, 'Botble\\RealEstate\\Models\\Property', 8, '10km'),
(691, 45, 'Botble\\RealEstate\\Models\\Property', 9, '17km'),
(692, 45, 'Botble\\RealEstate\\Models\\Property', 10, '19km'),
(693, 45, 'Botble\\RealEstate\\Models\\Property', 11, '15km'),
(694, 46, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(695, 46, 'Botble\\RealEstate\\Models\\Property', 2, '3km'),
(696, 46, 'Botble\\RealEstate\\Models\\Property', 3, '11km'),
(697, 46, 'Botble\\RealEstate\\Models\\Property', 4, '11km'),
(698, 46, 'Botble\\RealEstate\\Models\\Property', 5, '10km'),
(699, 46, 'Botble\\RealEstate\\Models\\Property', 6, '16km'),
(700, 46, 'Botble\\RealEstate\\Models\\Property', 7, '14km'),
(701, 46, 'Botble\\RealEstate\\Models\\Property', 8, '17km'),
(702, 46, 'Botble\\RealEstate\\Models\\Property', 9, '20km'),
(703, 46, 'Botble\\RealEstate\\Models\\Property', 10, '5km'),
(704, 46, 'Botble\\RealEstate\\Models\\Property', 11, '16km'),
(705, 47, 'Botble\\RealEstate\\Models\\Property', 1, '14km'),
(706, 47, 'Botble\\RealEstate\\Models\\Property', 2, '9km'),
(707, 47, 'Botble\\RealEstate\\Models\\Property', 3, '5km'),
(708, 47, 'Botble\\RealEstate\\Models\\Property', 4, '1km'),
(709, 47, 'Botble\\RealEstate\\Models\\Property', 5, '3km'),
(710, 47, 'Botble\\RealEstate\\Models\\Property', 6, '20km'),
(711, 47, 'Botble\\RealEstate\\Models\\Property', 7, '3km'),
(712, 47, 'Botble\\RealEstate\\Models\\Property', 8, '11km'),
(713, 47, 'Botble\\RealEstate\\Models\\Property', 9, '8km'),
(714, 47, 'Botble\\RealEstate\\Models\\Property', 10, '9km'),
(715, 47, 'Botble\\RealEstate\\Models\\Property', 11, '17km'),
(716, 48, 'Botble\\RealEstate\\Models\\Property', 1, '14km'),
(717, 48, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(718, 48, 'Botble\\RealEstate\\Models\\Property', 3, '2km'),
(719, 48, 'Botble\\RealEstate\\Models\\Property', 4, '19km'),
(720, 48, 'Botble\\RealEstate\\Models\\Property', 5, '10km'),
(721, 48, 'Botble\\RealEstate\\Models\\Property', 6, '12km'),
(722, 48, 'Botble\\RealEstate\\Models\\Property', 7, '9km'),
(723, 48, 'Botble\\RealEstate\\Models\\Property', 8, '19km'),
(724, 48, 'Botble\\RealEstate\\Models\\Property', 9, '14km'),
(725, 48, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(726, 48, 'Botble\\RealEstate\\Models\\Property', 11, '14km'),
(727, 49, 'Botble\\RealEstate\\Models\\Property', 1, '12km'),
(728, 49, 'Botble\\RealEstate\\Models\\Property', 2, '6km'),
(729, 49, 'Botble\\RealEstate\\Models\\Property', 3, '13km'),
(730, 49, 'Botble\\RealEstate\\Models\\Property', 4, '11km'),
(731, 49, 'Botble\\RealEstate\\Models\\Property', 5, '19km'),
(732, 49, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(733, 49, 'Botble\\RealEstate\\Models\\Property', 7, '9km'),
(734, 49, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(735, 49, 'Botble\\RealEstate\\Models\\Property', 9, '18km'),
(736, 49, 'Botble\\RealEstate\\Models\\Property', 10, '10km'),
(737, 49, 'Botble\\RealEstate\\Models\\Property', 11, '1km'),
(738, 50, 'Botble\\RealEstate\\Models\\Property', 1, '3km'),
(739, 50, 'Botble\\RealEstate\\Models\\Property', 2, '14km'),
(740, 50, 'Botble\\RealEstate\\Models\\Property', 3, '12km'),
(741, 50, 'Botble\\RealEstate\\Models\\Property', 4, '13km'),
(742, 50, 'Botble\\RealEstate\\Models\\Property', 5, '18km'),
(743, 50, 'Botble\\RealEstate\\Models\\Property', 6, '15km'),
(744, 50, 'Botble\\RealEstate\\Models\\Property', 7, '10km'),
(745, 50, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(746, 50, 'Botble\\RealEstate\\Models\\Property', 9, '7km'),
(747, 50, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(748, 50, 'Botble\\RealEstate\\Models\\Property', 11, '9km'),
(749, 51, 'Botble\\RealEstate\\Models\\Property', 1, '15km'),
(750, 51, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(751, 51, 'Botble\\RealEstate\\Models\\Property', 3, '7km'),
(752, 51, 'Botble\\RealEstate\\Models\\Property', 4, '11km'),
(753, 51, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(754, 51, 'Botble\\RealEstate\\Models\\Property', 6, '18km'),
(755, 51, 'Botble\\RealEstate\\Models\\Property', 7, '18km'),
(756, 51, 'Botble\\RealEstate\\Models\\Property', 8, '19km'),
(757, 51, 'Botble\\RealEstate\\Models\\Property', 9, '4km'),
(758, 51, 'Botble\\RealEstate\\Models\\Property', 10, '11km'),
(759, 51, 'Botble\\RealEstate\\Models\\Property', 11, '11km'),
(760, 52, 'Botble\\RealEstate\\Models\\Property', 1, '5km'),
(761, 52, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(762, 52, 'Botble\\RealEstate\\Models\\Property', 3, '13km'),
(763, 52, 'Botble\\RealEstate\\Models\\Property', 4, '4km'),
(764, 52, 'Botble\\RealEstate\\Models\\Property', 5, '14km'),
(765, 52, 'Botble\\RealEstate\\Models\\Property', 6, '8km'),
(766, 52, 'Botble\\RealEstate\\Models\\Property', 7, '19km'),
(767, 52, 'Botble\\RealEstate\\Models\\Property', 8, '11km'),
(768, 52, 'Botble\\RealEstate\\Models\\Property', 9, '19km'),
(769, 52, 'Botble\\RealEstate\\Models\\Property', 10, '9km'),
(770, 52, 'Botble\\RealEstate\\Models\\Property', 11, '5km'),
(771, 53, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(772, 53, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(773, 53, 'Botble\\RealEstate\\Models\\Property', 3, '19km'),
(774, 53, 'Botble\\RealEstate\\Models\\Property', 4, '11km'),
(775, 53, 'Botble\\RealEstate\\Models\\Property', 5, '18km'),
(776, 53, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(777, 53, 'Botble\\RealEstate\\Models\\Property', 7, '20km'),
(778, 53, 'Botble\\RealEstate\\Models\\Property', 8, '7km'),
(779, 53, 'Botble\\RealEstate\\Models\\Property', 9, '11km'),
(780, 53, 'Botble\\RealEstate\\Models\\Property', 10, '12km'),
(781, 53, 'Botble\\RealEstate\\Models\\Property', 11, '20km'),
(782, 54, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(783, 54, 'Botble\\RealEstate\\Models\\Property', 2, '10km'),
(784, 54, 'Botble\\RealEstate\\Models\\Property', 3, '2km'),
(785, 54, 'Botble\\RealEstate\\Models\\Property', 4, '5km'),
(786, 54, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(787, 54, 'Botble\\RealEstate\\Models\\Property', 6, '11km'),
(788, 54, 'Botble\\RealEstate\\Models\\Property', 7, '14km'),
(789, 54, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(790, 54, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(791, 54, 'Botble\\RealEstate\\Models\\Property', 10, '4km'),
(792, 54, 'Botble\\RealEstate\\Models\\Property', 11, '1km'),
(793, 55, 'Botble\\RealEstate\\Models\\Property', 1, '2km'),
(794, 55, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(795, 55, 'Botble\\RealEstate\\Models\\Property', 3, '9km'),
(796, 55, 'Botble\\RealEstate\\Models\\Property', 4, '18km'),
(797, 55, 'Botble\\RealEstate\\Models\\Property', 5, '13km'),
(798, 55, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(799, 55, 'Botble\\RealEstate\\Models\\Property', 7, '2km'),
(800, 55, 'Botble\\RealEstate\\Models\\Property', 8, '12km'),
(801, 55, 'Botble\\RealEstate\\Models\\Property', 9, '13km'),
(802, 55, 'Botble\\RealEstate\\Models\\Property', 10, '1km'),
(803, 55, 'Botble\\RealEstate\\Models\\Property', 11, '12km'),
(804, 56, 'Botble\\RealEstate\\Models\\Property', 1, '4km'),
(805, 56, 'Botble\\RealEstate\\Models\\Property', 2, '8km'),
(806, 56, 'Botble\\RealEstate\\Models\\Property', 3, '8km'),
(807, 56, 'Botble\\RealEstate\\Models\\Property', 4, '16km'),
(808, 56, 'Botble\\RealEstate\\Models\\Property', 5, '4km'),
(809, 56, 'Botble\\RealEstate\\Models\\Property', 6, '5km'),
(810, 56, 'Botble\\RealEstate\\Models\\Property', 7, '17km'),
(811, 56, 'Botble\\RealEstate\\Models\\Property', 8, '3km'),
(812, 56, 'Botble\\RealEstate\\Models\\Property', 9, '15km'),
(813, 56, 'Botble\\RealEstate\\Models\\Property', 10, '7km'),
(814, 56, 'Botble\\RealEstate\\Models\\Property', 11, '14km'),
(815, 57, 'Botble\\RealEstate\\Models\\Property', 1, '19km'),
(816, 57, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(817, 57, 'Botble\\RealEstate\\Models\\Property', 3, '17km'),
(818, 57, 'Botble\\RealEstate\\Models\\Property', 4, '12km'),
(819, 57, 'Botble\\RealEstate\\Models\\Property', 5, '20km'),
(820, 57, 'Botble\\RealEstate\\Models\\Property', 6, '16km'),
(821, 57, 'Botble\\RealEstate\\Models\\Property', 7, '11km'),
(822, 57, 'Botble\\RealEstate\\Models\\Property', 8, '18km'),
(823, 57, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(824, 57, 'Botble\\RealEstate\\Models\\Property', 10, '16km'),
(825, 57, 'Botble\\RealEstate\\Models\\Property', 11, '9km'),
(826, 58, 'Botble\\RealEstate\\Models\\Property', 1, '3km'),
(827, 58, 'Botble\\RealEstate\\Models\\Property', 2, '2km'),
(828, 58, 'Botble\\RealEstate\\Models\\Property', 3, '13km'),
(829, 58, 'Botble\\RealEstate\\Models\\Property', 4, '13km'),
(830, 58, 'Botble\\RealEstate\\Models\\Property', 5, '19km'),
(831, 58, 'Botble\\RealEstate\\Models\\Property', 6, '11km'),
(832, 58, 'Botble\\RealEstate\\Models\\Property', 7, '12km'),
(833, 58, 'Botble\\RealEstate\\Models\\Property', 8, '15km'),
(834, 58, 'Botble\\RealEstate\\Models\\Property', 9, '9km'),
(835, 58, 'Botble\\RealEstate\\Models\\Property', 10, '3km'),
(836, 58, 'Botble\\RealEstate\\Models\\Property', 11, '17km'),
(837, 59, 'Botble\\RealEstate\\Models\\Property', 1, '17km'),
(838, 59, 'Botble\\RealEstate\\Models\\Property', 2, '17km'),
(839, 59, 'Botble\\RealEstate\\Models\\Property', 3, '9km'),
(840, 59, 'Botble\\RealEstate\\Models\\Property', 4, '5km'),
(841, 59, 'Botble\\RealEstate\\Models\\Property', 5, '2km'),
(842, 59, 'Botble\\RealEstate\\Models\\Property', 6, '13km'),
(843, 59, 'Botble\\RealEstate\\Models\\Property', 7, '4km');
INSERT INTO `re_facilities_distances` (`id`, `reference_id`, `reference_type`, `facility_id`, `distance`) VALUES
(844, 59, 'Botble\\RealEstate\\Models\\Property', 8, '19km'),
(845, 59, 'Botble\\RealEstate\\Models\\Property', 9, '1km'),
(846, 59, 'Botble\\RealEstate\\Models\\Property', 10, '1km'),
(847, 59, 'Botble\\RealEstate\\Models\\Property', 11, '4km'),
(848, 60, 'Botble\\RealEstate\\Models\\Property', 1, '10km'),
(849, 60, 'Botble\\RealEstate\\Models\\Property', 2, '20km'),
(850, 60, 'Botble\\RealEstate\\Models\\Property', 3, '10km'),
(851, 60, 'Botble\\RealEstate\\Models\\Property', 4, '11km'),
(852, 60, 'Botble\\RealEstate\\Models\\Property', 5, '11km'),
(853, 60, 'Botble\\RealEstate\\Models\\Property', 6, '3km'),
(854, 60, 'Botble\\RealEstate\\Models\\Property', 7, '17km'),
(855, 60, 'Botble\\RealEstate\\Models\\Property', 8, '4km'),
(856, 60, 'Botble\\RealEstate\\Models\\Property', 9, '2km'),
(857, 60, 'Botble\\RealEstate\\Models\\Property', 10, '15km'),
(858, 60, 'Botble\\RealEstate\\Models\\Property', 11, '1km'),
(859, 61, 'Botble\\RealEstate\\Models\\Property', 1, '4km'),
(860, 61, 'Botble\\RealEstate\\Models\\Property', 2, '7km'),
(861, 61, 'Botble\\RealEstate\\Models\\Property', 3, '13km'),
(862, 61, 'Botble\\RealEstate\\Models\\Property', 4, '12km'),
(863, 61, 'Botble\\RealEstate\\Models\\Property', 5, '3km'),
(864, 61, 'Botble\\RealEstate\\Models\\Property', 6, '10km'),
(865, 61, 'Botble\\RealEstate\\Models\\Property', 7, '8km'),
(866, 61, 'Botble\\RealEstate\\Models\\Property', 8, '2km'),
(867, 61, 'Botble\\RealEstate\\Models\\Property', 9, '13km'),
(868, 61, 'Botble\\RealEstate\\Models\\Property', 10, '8km'),
(869, 61, 'Botble\\RealEstate\\Models\\Property', 11, '19km');

-- --------------------------------------------------------

--
-- Table structure for table `re_features`
--

CREATE TABLE `re_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `icon` varchar(60) DEFAULT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_features`
--

INSERT INTO `re_features` (`id`, `name`, `icon`, `status`) VALUES
(1, 'Air Conditioning', 'ti ti-wind', 'published'),
(2, 'Swimming Pool', 'ti ti-pool', 'published'),
(3, 'Gym / Fitness', 'ti ti-barbell', 'published'),
(4, 'Parking', 'ti ti-parking', 'published'),
(5, 'Garden', 'ti ti-plant', 'published'),
(6, 'Security', 'ti ti-shield', 'published'),
(7, 'Elevator', 'ti ti-elevator', 'published'),
(8, 'Balcony', 'ti ti-home', 'published'),
(9, 'Pet Friendly', 'ti ti-dog', 'published'),
(10, 'Smart Home', 'ti ti-smart-home', 'published'),
(11, 'Solar Panels', 'ti ti-solar-panel', 'published'),
(12, 'Fireplace', 'ti ti-flame', 'published');

-- --------------------------------------------------------

--
-- Table structure for table `re_investors`
--

CREATE TABLE `re_investors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_investors`
--

INSERT INTO `re_investors` (`id`, `name`, `status`, `created_at`, `updated_at`, `logo`, `website`) VALUES
(1, 'National Pension Service', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(2, 'Generali', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(3, 'Temasek', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(4, 'China Investment Corporation', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(5, 'Government Pension Fund Global', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(6, 'PSP Investments', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(7, 'MEAG Munich ERGO', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(8, 'HOOPP', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(9, 'BT Group', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(10, 'New York City ERS', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(11, 'New Jersey Division of Investment', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(12, 'State Super', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(13, 'Shinkong', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL),
(14, 'Rest Super', 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `re_packages`
--

CREATE TABLE `re_packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `price` double UNSIGNED NOT NULL,
  `currency_id` bigint(20) UNSIGNED NOT NULL,
  `percent_save` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `number_of_listings` int(10) UNSIGNED NOT NULL,
  `account_limit` int(10) UNSIGNED DEFAULT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `is_default` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `description` varchar(400) DEFAULT NULL,
  `features` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_packages`
--

INSERT INTO `re_packages` (`id`, `name`, `price`, `currency_id`, `percent_save`, `number_of_listings`, `account_limit`, `order`, `is_default`, `status`, `description`, `features`, `created_at`, `updated_at`) VALUES
(1, 'Free Trial', 0, 1, 0, 1, 1, 1, 0, 'published', NULL, '[[{\"key\":\"text\",\"value\":\"Limited time trial period\"}],[{\"key\":\"text\",\"value\":\"1 listing allowed\"}],[{\"key\":\"text\",\"value\":\"Basic support\"}]]', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'Basic Listing', 250, 1, 0, 1, 5, 2, 1, 'published', NULL, '[[{\"key\":\"text\",\"value\":\"1 listing allowed\"}],[{\"key\":\"text\",\"value\":\"5 photos per listing\"}],[{\"key\":\"text\",\"value\":\"Basic support\"}]]', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'Standard Package', 1000, 1, 20, 5, 10, 3, 0, 'published', NULL, '[[{\"key\":\"text\",\"value\":\"5 listings allowed\"}],[{\"key\":\"text\",\"value\":\"10 photos per listing\"}],[{\"key\":\"text\",\"value\":\"Priority support\"}]]', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'Professional Package', 1800, 1, 28, 10, 15, 4, 0, 'published', NULL, '[[{\"key\":\"text\",\"value\":\"10 listings allowed\"}],[{\"key\":\"text\",\"value\":\"15 photos per listing\"}],[{\"key\":\"text\",\"value\":\"Premium support\"}],[{\"key\":\"text\",\"value\":\"Featured listings\"}]]', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Premium Package', 2500, 1, 33, 15, 20, 5, 0, 'published', NULL, '[[{\"key\":\"text\",\"value\":\"15 listings allowed\"}],[{\"key\":\"text\",\"value\":\"20 photos per listing\"}],[{\"key\":\"text\",\"value\":\"Premium support\"}],[{\"key\":\"text\",\"value\":\"Featured listings\"}],[{\"key\":\"text\",\"value\":\"Priority listing placement\"}]]', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `re_projects`
--

CREATE TABLE `re_projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(300) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `images` text DEFAULT NULL,
  `floor_plans` longtext DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `investor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `number_block` int(11) DEFAULT NULL,
  `number_floor` smallint(6) DEFAULT NULL,
  `number_flat` smallint(6) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `featured_priority` int(11) NOT NULL DEFAULT 0,
  `date_finish` date DEFAULT NULL,
  `date_sell` date DEFAULT NULL,
  `price_from` decimal(15,0) DEFAULT NULL,
  `price_to` decimal(15,0) DEFAULT NULL,
  `currency_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `status` varchar(60) NOT NULL DEFAULT 'selling',
  `author_id` bigint(20) UNSIGNED DEFAULT NULL,
  `author_type` varchar(255) NOT NULL DEFAULT 'BotbleACLModelsUser',
  `latitude` varchar(25) DEFAULT NULL,
  `longitude` varchar(25) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `unique_id` varchar(255) DEFAULT NULL,
  `private_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_projects`
--

INSERT INTO `re_projects` (`id`, `name`, `description`, `content`, `images`, `floor_plans`, `location`, `investor_id`, `number_block`, `number_floor`, `number_flat`, `is_featured`, `featured_priority`, `date_finish`, `date_sell`, `price_from`, `price_to`, `currency_id`, `city_id`, `state_id`, `country_id`, `status`, `author_id`, `author_type`, `latitude`, `longitude`, `zip_code`, `views`, `unique_id`, `private_notes`, `created_at`, `updated_at`) VALUES
(1, 'Walnut Park Apartments', 'Luxury living redefined with world-class facilities, stunning architecture, and convenient access to urban conveniences.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '50 Riverside Way, Marina District', 11, 4, 33, 1398, 1, 8, '2028-01-12', '2025-12-12', 9741, 13969, 1, 6, 3, 3, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4836', '-75.8423', NULL, 1224, 'DQO2BB', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(2, 'Sunshine Wonder Villas', 'An innovative mixed-use development combining residential comfort with commercial convenience in a vibrant community setting.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '250 Parkview Boulevard, Central Heights', 3, 3, 50, 741, 1, 3, '2027-02-12', '2025-09-12', 12500, 25000, 1, 4, 2, 2, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5101', '-75.6234', NULL, 4223, 'YNHJLM', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(3, 'Diamond Island', 'A premier residential development offering modern living with exceptional amenities and thoughtful design in a prime location.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '75 Harbor Gateway, Waterfront Quarter', 9, 10, 46, 1284, 0, 0, '2028-07-12', '2025-12-12', 8200, 18500, 1, 19, 9, 9, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5234', '-75.7145', NULL, 3639, 'IDI8TT', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(4, 'The Nassim', 'Experience elevated living in this thoughtfully planned community featuring green spaces, modern homes, and premium amenities.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '400 Skyline Avenue, Downtown Core', 2, 2, 29, 1285, 1, 2, '2028-12-12', '2026-01-12', 20000, 45000, 1, 22, 10, 10, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4901', '-75.9012', NULL, 4804, 'VH7HVI', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(5, 'Vinhomes Grand Park', 'A landmark development setting new standards for quality construction, sustainable design, and community living.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '180 Garden Terrace, Green Valley', 8, 3, 42, 199, 0, 0, '2028-03-12', '2026-03-12', 5500, 12000, 1, 16, 8, 8, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5567', '-75.5234', NULL, 6400, 'NXIU77', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(6, 'The Metropole Thu Thiem', 'Premium residences designed for discerning homeowners who appreciate quality, location, and lifestyle excellence.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '320 Summit Road, Highland Park', 5, 6, 41, 1410, 1, 10, '2029-01-12', '2026-03-12', 15000, 35000, 1, 1, 1, 1, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4712', '-75.8901', NULL, 4866, 'UKWN06', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(7, 'Villa on Grand Avenue', 'Luxury living redefined with world-class facilities, stunning architecture, and convenient access to urban conveniences.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '100 Innovation Drive, Tech District', 4, 3, 8, 968, 0, 0, '2028-12-12', '2025-12-12', 18000, 30000, 1, 8, 4, 4, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5123', '-75.6789', NULL, 3745, 'FNJA6M', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(8, 'Traditional Food Restaurant', 'An innovative mixed-use development combining residential comfort with commercial convenience in a vibrant community setting.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '600 Metropolitan Center, Business Hub', 7, 6, 35, 231, 0, 0, '2028-06-12', '2025-08-12', 6000, 10000, 1, 12, 6, 6, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4856', '-75.7234', NULL, 1143, 'QKSZJL', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(9, 'Villa on Hollywood Boulevard', 'A premier residential development offering modern living with exceptional amenities and thoughtful design in a prime location.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '654 Birch Boulevard, Sunset Hills', 1, 5, 38, 1217, 1, 2, '2028-11-12', '2025-05-12', 25000, 50000, 1, 6, 3, 3, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5345', '-75.5901', NULL, 5337, '0CZJLK', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(10, 'Office Space at Northwest 107th', 'Experience elevated living in this thoughtfully planned community featuring green spaces, modern homes, and premium amenities.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '987 Elm Drive, Mountain View', 6, 9, 17, 1051, 0, 0, '2029-03-12', '2026-03-12', 9000, 18000, 1, 4, 2, 2, 'pre-sale', 1, 'Botble\\ACL\\Models\\User', '42.5678', '-75.4567', NULL, 648, 'ZTJ7KW', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(11, 'Home in Merrick Way', 'A landmark development setting new standards for quality construction, sustainable design, and community living.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '147 Willow Way, Harbor Point', 14, 6, 25, 865, 0, 0, '2028-09-12', '2026-01-12', 7500, 14000, 1, 19, 9, 9, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4934', '-75.8234', NULL, 3976, 'CEKP4M', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(12, 'Adarsh Greens', 'Premium residences designed for discerning homeowners who appreciate quality, location, and lifestyle excellence.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '258 Spruce Court, Valley Green', 10, 4, 25, 389, 0, 0, '2028-06-12', '2026-04-12', 11000, 22000, 1, 22, 10, 10, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5012', '-75.7456', NULL, 2553, 'JMDWC7', NULL, '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(13, 'Rustomjee Evershine Global City', 'Luxury living redefined with world-class facilities, stunning architecture, and convenient access to urban conveniences.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"projects\\\\\\/c1efafb4-abe3-4a5c-b596-21e32c0c1419.png\\\",\\\"properties\\\\\\/1.jpg\\\",\\\"properties\\\\\\/4.jpg\\\",\\\"properties\\\\\\/5.jpg\\\",\\\"properties\\\\\\/6.jpg\\\",\\\"properties\\\\\\/7.jpg\\\",\\\"properties\\\\\\/10.jpg\\\",\\\"properties\\\\\\/11.jpg\\\"]\"', NULL, '369 Ash Circle, Meadow Springs', 12, 6, 23, 760, 0, 0, '2027-07-12', '2025-07-12', 8800, 19500, 1, 16, 8, 8, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5289', '-75.6123', NULL, 1193, 'LROOXC', NULL, '2026-05-12 19:43:41', '2026-05-12 20:03:03'),
(14, 'Godrej Exquisite', 'An innovative mixed-use development combining residential comfort with commercial convenience in a vibrant community setting.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '741 Hickory Place, Forest Glen', 13, 7, 9, 553, 0, 0, '2029-03-12', '2026-04-12', 14000, 28000, 1, 1, 1, 1, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.4789', '-75.8678', NULL, 9814, 'G0DSSE', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(15, 'Godrej Prime', 'A premier residential development offering modern living with exceptional amenities and thoughtful design in a prime location.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '456 Maple Avenue, Downtown District', 13, 9, 38, 1120, 0, 0, '2027-07-12', '2025-08-12', 16500, 32000, 1, 8, 4, 4, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5456', '-75.5345', NULL, 2419, 'ICUT0X', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(16, 'PS Panache', 'Experience elevated living in this thoughtfully planned community featuring green spaces, modern homes, and premium amenities.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '123 Oak Street, Riverside Heights', 2, 3, 15, 916, 0, 0, '2028-06-12', '2026-04-12', 10500, 21000, 1, 12, 6, 6, 'pre-sale', 1, 'Botble\\ACL\\Models\\User', '42.4623', '-75.9234', NULL, 3553, 'OUEETA', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(17, 'Upturn Atmiya Centria', 'A landmark development setting new standards for quality construction, sustainable design, and community living.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', NULL, '321 Cedar Lane, Lakeside Park', 6, 7, 50, 1010, 0, 0, '2029-04-12', '2025-09-12', 7200, 15500, 1, 6, 3, 3, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5156', '-75.7012', NULL, 9680, 'ODGAUI', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(18, 'Brigade Oasis', 'Premium residences designed for discerning homeowners who appreciate quality, location, and lifestyle excellence.', 'This prestigious development represents the pinnacle of urban living, combining architectural excellence with practical functionality. Every aspect of this project has been carefully considered, from the grand entrance lobbies to the thoughtfully designed living spaces. The project features multiple building configurations to suit different lifestyles and preferences, all unified by consistent quality and aesthetic appeal. Residents benefit from comprehensive amenities including covered parking, 24/7 security, recreational facilities, and beautifully maintained common areas. The development is strategically located to offer easy access to major business districts, educational institutions, and entertainment venues while providing a peaceful retreat from city bustle. Our commitment to quality extends beyond construction to include attentive property management and responsive customer service. Whether you are seeking a primary residence or an investment property, this development offers exceptional value and lasting appeal.', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', NULL, '654 Birch Boulevard, Sunset Hills', 9, 3, 36, 464, 0, 0, '2027-01-12', '2025-08-12', 13000, 27000, 1, 19, 9, 9, 'selling', 1, 'Botble\\ACL\\Models\\User', '42.5389', '-75.5678', NULL, 4796, 'TSLWVA', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `re_project_categories`
--

CREATE TABLE `re_project_categories` (
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_project_categories`
--

INSERT INTO `re_project_categories` (`project_id`, `category_id`) VALUES
(1, 5),
(2, 3),
(2, 6),
(3, 1),
(3, 3),
(3, 5),
(4, 6),
(5, 6),
(6, 6),
(7, 2),
(7, 4),
(7, 5),
(8, 3),
(8, 4),
(8, 6),
(9, 1),
(10, 1),
(10, 6),
(11, 5),
(12, 4),
(12, 5),
(12, 6),
(13, 1),
(13, 3),
(13, 5),
(14, 1),
(14, 2),
(14, 5),
(15, 2),
(15, 5),
(15, 6),
(16, 2),
(16, 5),
(16, 6),
(17, 1),
(17, 3),
(17, 4),
(18, 2),
(18, 5);

-- --------------------------------------------------------

--
-- Table structure for table `re_project_features`
--

CREATE TABLE `re_project_features` (
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `feature_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_project_features`
--

INSERT INTO `re_project_features` (`project_id`, `feature_id`) VALUES
(1, 1),
(1, 8),
(1, 9),
(1, 12),
(2, 2),
(2, 3),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 10),
(4, 4),
(4, 6),
(4, 9),
(4, 11),
(5, 1),
(5, 2),
(5, 3),
(5, 5),
(5, 6),
(5, 7),
(5, 10),
(5, 12),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5),
(6, 7),
(6, 8),
(6, 9),
(6, 10),
(6, 11),
(6, 12),
(7, 3),
(7, 4),
(7, 5),
(7, 7),
(7, 8),
(7, 9),
(7, 10),
(7, 11),
(8, 1),
(8, 2),
(8, 3),
(8, 6),
(8, 10),
(8, 11),
(9, 1),
(9, 2),
(9, 5),
(9, 9),
(9, 11),
(10, 1),
(10, 3),
(10, 5),
(10, 6),
(10, 8),
(10, 10),
(10, 12),
(11, 1),
(11, 2),
(11, 8),
(11, 10),
(12, 1),
(12, 2),
(12, 3),
(12, 4),
(12, 6),
(12, 7),
(12, 8),
(12, 9),
(12, 10),
(12, 12),
(13, 1),
(13, 3),
(13, 6),
(13, 9),
(13, 10),
(14, 2),
(14, 3),
(14, 4),
(14, 5),
(14, 6),
(14, 8),
(14, 10),
(15, 1),
(15, 2),
(15, 7),
(15, 9),
(15, 10),
(15, 12),
(16, 1),
(16, 4),
(16, 7),
(16, 8),
(16, 9),
(16, 11),
(16, 12),
(17, 1),
(17, 3),
(17, 4),
(17, 5),
(17, 6),
(17, 7),
(17, 8),
(17, 9),
(17, 10),
(17, 11),
(17, 12),
(18, 1),
(18, 3),
(18, 4),
(18, 5),
(18, 6),
(18, 7),
(18, 10),
(18, 12);

-- --------------------------------------------------------

--
-- Table structure for table `re_properties`
--

CREATE TABLE `re_properties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(300) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'sale',
  `description` varchar(400) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `floor_plans` longtext DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `number_bedroom` decimal(8,1) NOT NULL DEFAULT 0.0,
  `number_bathroom` decimal(8,1) NOT NULL DEFAULT 0.0,
  `number_floor` int(11) DEFAULT NULL,
  `square` double DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `currency_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `featured_priority` int(11) NOT NULL DEFAULT 0,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `period` varchar(30) NOT NULL DEFAULT 'month',
  `status` varchar(60) NOT NULL DEFAULT 'selling',
  `author_id` bigint(20) UNSIGNED DEFAULT NULL,
  `author_type` varchar(255) NOT NULL DEFAULT 'BotbleACLModelsUser',
  `moderation_status` varchar(60) NOT NULL DEFAULT 'pending',
  `reject_reason` varchar(400) DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT 0,
  `never_expired` tinyint(1) NOT NULL DEFAULT 0,
  `latitude` varchar(25) DEFAULT NULL,
  `longitude` varchar(25) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `unique_id` varchar(255) DEFAULT NULL,
  `private_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_properties`
--

INSERT INTO `re_properties` (`id`, `name`, `type`, `description`, `content`, `location`, `images`, `floor_plans`, `project_id`, `number_bedroom`, `number_bathroom`, `number_floor`, `square`, `price`, `currency_id`, `is_featured`, `featured_priority`, `city_id`, `state_id`, `country_id`, `period`, `status`, `author_id`, `author_type`, `moderation_status`, `reject_reason`, `expire_date`, `auto_renew`, `never_expired`, `latitude`, `longitude`, `zip_code`, `views`, `unique_id`, `private_notes`, `created_at`, `updated_at`) VALUES
(1, '3 Beds Villa Calpe, Alicante', 'rent', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 1, 2.0, 4.0, 19, 179, 791600.00, 1, 1, 8, 6, 3, 3, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-17', 0, 1, '42.5167', '-75.2043', NULL, 30922, 'GYEDF4', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(2, 'Lavida Plus Office-tel 1 Bedroom', 'sale', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 2.0, 15, 399, 699100.00, 1, 1, 7, 4, 2, 2, 'month', 'selling', 2, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-30', 0, 1, '42.8546', '-75.3176', NULL, 13830, 'CH94UB', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(3, 'Vinhomes Grand Park Studio 1 Bedroom', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 13, 122, 958600.00, 1, 1, 6, 1, 1, 1, 'month', 'selling', 3, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-08-06', 0, 1, '42.8441', '-76.4363', NULL, 50360, 'MPVWWE', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(4, 'The Sun Avenue Office-tel 1 Bedroom', 'rent', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 22, 183, 95300.00, 1, 1, 5, 8, 4, 4, 'month', 'renting', 4, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-02-11', 0, 1, '42.6626', '-76.7277', NULL, 6629, '845HWF', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(5, 'Property For sale, Johannesburg, South Africa', 'sale', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 4.0, 21, 90, 688200.00, 1, 1, 4, 12, 6, 6, 'month', 'selling', 5, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-08-05', 0, 1, '43.6016', '-76.6453', NULL, 22742, 'AT9PQQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(6, 'Stunning French Inspired Manor', 'sale', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 6, 5.0, 1.0, 19, 292, 619300.00, 1, 1, 3, 22, 10, 10, 'month', 'selling', 6, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-01-10', 0, 1, '43.0985', '-75.6866', NULL, 50736, 'X79LYQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(7, 'Villa for sale at Bermuda Dunes', 'rent', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 7, 122, 769800.00, 1, 1, 2, 14, 7, 7, 'month', 'renting', 7, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-11-15', 0, 1, '43.9502', '-75.2355', NULL, 20552, 'VXTZBQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(8, 'Walnut Park Apartment', 'sale', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 3.0, 47, 476, 864900.00, 1, 1, 1, 16, 8, 8, 'month', 'selling', 8, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-21', 0, 1, '42.9766', '-75.3414', NULL, 91026, 'PV8ATH', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(9, '5 beds luxury house', 'sale', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 4.0, 29, 315, 192400.00, 1, 0, 0, 19, 9, 9, 'month', 'selling', 9, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-11-19', 0, 1, '43.8725', '-75.8264', NULL, 5020, 'XPMOOX', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(10, 'Family Victorian \"View\" Home', 'rent', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 1.0, 46, 104, 809700.00, 1, 0, 0, 10, 5, 5, 'month', 'renting', 10, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-05-03', 0, 1, '43.3792', '-76.0198', NULL, 98313, 'JTSYAM', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(11, 'Osaka Heights Apartment', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 11, 6.0, 3.0, 25, 145, 644900.00, 1, 0, 0, 6, 3, 3, 'month', 'selling', 11, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-10', 0, 1, '42.6781', '-76.2075', NULL, 43088, 'KM50ON', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(12, 'Private Estate Magnificent Views', 'sale', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 3.0, 28, 444, 820400.00, 1, 0, 0, 4, 2, 2, 'month', 'selling', 12, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-29', 0, 1, '43.3743', '-74.9217', NULL, 58756, 'JOA5E1', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(13, 'Thompson Road House for rent', 'rent', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 3.0, 8, 201, 197800.00, 1, 0, 0, 1, 1, 1, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-12', 0, 1, '42.5156', '-76.6842', NULL, 56855, 'NPZ6FN', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(14, 'Brand New 1 Bedroom Apartment In First Class Location', 'sale', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 2.0, 3.0, 20, 90, 269100.00, 1, 0, 0, 8, 4, 4, 'month', 'selling', 2, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-02-14', 0, 1, '42.9089', '-75.1844', NULL, 69242, 'FS1MCQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(15, 'Elegant family home presents premium modern living', 'sale', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 1.0, 28, 316, 152700.00, 1, 0, 0, 12, 6, 6, 'month', 'selling', 3, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-20', 0, 1, '42.5906', '-76.6036', NULL, 77402, 'DDLDO3', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(16, 'Luxury Apartments in Singapore for Sale', 'rent', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 16, 3.0, 4.0, 33, 382, 542900.00, 1, 0, 0, 22, 10, 10, 'month', 'renting', 4, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-21', 0, 1, '43.9032', '-75.7870', NULL, 73959, 'R9RHTT', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(17, '5 room luxury penthouse for sale in Kuala Lumpur', 'sale', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 2.0, 4.0, 14, 304, 949700.00, 1, 0, 0, 14, 7, 7, 'month', 'selling', 5, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-28', 0, 1, '42.8773', '-76.6083', NULL, 58658, 'TBTTOU', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(18, '2 Floor house in Compound Pejaten Barat Kemang', 'sale', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 1.0, 5, 200, 111800.00, 1, 0, 0, 16, 8, 8, 'month', 'selling', 6, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-16', 0, 1, '42.6551', '-75.5319', NULL, 80350, '3VW3HI', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(19, 'Apartment Muiderstraatweg in Diemen', 'rent', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 2.0, 2.0, 40, 188, 228800.00, 1, 0, 0, 19, 9, 9, 'month', 'renting', 7, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-01-16', 0, 1, '43.3466', '-75.7703', NULL, 590, 'D3HE6S', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(20, 'Nice Apartment for rent in Berlin', 'sale', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 2.0, 13, 470, 542400.00, 1, 0, 0, 10, 5, 5, 'month', 'selling', 8, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-04-02', 0, 1, '43.5433', '-75.7033', NULL, 6552, 'V6VBQR', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(21, 'Pumpkin Key - Private Island', 'sale', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 3, 1.0, 4.0, 22, 50, 255800.00, 1, 0, 0, 6, 3, 3, 'month', 'selling', 9, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-08-31', 0, 1, '42.7930', '-76.6877', NULL, 83215, 'QM5MXE', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(22, 'Maplewood Estates', 'rent', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 1.0, 45, 55, 357200.00, 1, 0, 0, 4, 2, 2, 'month', 'renting', 10, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-12-31', 0, 1, '43.1396', '-74.9412', NULL, 13975, 'JW2G1Q', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(23, 'Pine Ridge Manor', 'sale', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 3.0, 31, 476, 676000.00, 1, 0, 0, 1, 1, 1, 'month', 'selling', 11, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-04-17', 0, 1, '42.5142', '-75.0456', NULL, 16691, 'FRYUZV', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41');
INSERT INTO `re_properties` (`id`, `name`, `type`, `description`, `content`, `location`, `images`, `floor_plans`, `project_id`, `number_bedroom`, `number_bathroom`, `number_floor`, `square`, `price`, `currency_id`, `is_featured`, `featured_priority`, `city_id`, `state_id`, `country_id`, `period`, `status`, `author_id`, `author_type`, `moderation_status`, `reject_reason`, `expire_date`, `auto_renew`, `never_expired`, `latitude`, `longitude`, `zip_code`, `views`, `unique_id`, `private_notes`, `created_at`, `updated_at`) VALUES
(24, 'Oak Hill Residences', 'sale', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 1.0, 4.0, 16, 268, 796000.00, 1, 0, 0, 8, 4, 4, 'month', 'selling', 12, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-04-15', 0, 1, '42.6295', '-74.8257', NULL, 43246, 'MI6MHQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(25, 'Sunnybrook Villas', 'rent', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 3.0, 22, 303, 887200.00, 1, 0, 0, 12, 6, 6, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-01-04', 0, 1, '42.7501', '-76.4112', NULL, 18572, 'CPGFCH', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(26, 'Riverstone Condominiums', 'sale', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 8, 6.0, 2.0, 7, 383, 610800.00, 1, 0, 0, 22, 10, 10, 'month', 'selling', 2, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-07-19', 0, 1, '43.5312', '-76.0790', NULL, 75963, 'SJWDSM', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(27, 'Cedar Park Apartments', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 1.0, 41, 189, 633300.00, 1, 0, 0, 14, 7, 7, 'month', 'selling', 3, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-07', 0, 1, '43.7027', '-76.3035', NULL, 37684, 'DCTRAA', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(28, 'Lakeside Retreat', 'rent', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 3.0, 34, 468, 104400.00, 1, 0, 0, 16, 8, 8, 'month', 'renting', 4, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-05', 0, 1, '42.9608', '-75.7447', NULL, 96856, '8LQNFD', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(29, 'Willow Creek Homes', 'sale', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 4.0, 14, 183, 940000.00, 1, 0, 0, 19, 9, 9, 'month', 'selling', 5, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-29', 0, 1, '43.8314', '-75.9503', NULL, 80258, 'JRXZOQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(30, 'Grandview Heights', 'sale', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 2.0, 7, 154, 742400.00, 1, 0, 0, 10, 5, 5, 'month', 'selling', 6, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-01-23', 0, 1, '43.3556', '-75.1707', NULL, 54435, 'KXJ16Y', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(31, 'Forest Glen Cottages', 'rent', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 13, 6.0, 3.0, 3, 335, 752900.00, 1, 0, 0, 6, 3, 3, 'month', 'renting', 7, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-12-28', 0, 1, '42.5806', '-75.5152', NULL, 61428, 'GPVXUV', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(32, 'Harborview Towers', 'sale', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 22, 264, 333800.00, 1, 0, 0, 4, 2, 2, 'month', 'selling', 8, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-22', 0, 1, '43.7398', '-74.9702', NULL, 72069, 'EETXBF', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(33, 'Meadowlands Estates', 'sale', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 1.0, 1.0, 40, 169, 742400.00, 1, 0, 0, 1, 1, 1, 'month', 'selling', 9, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-19', 0, 1, '43.8435', '-76.4146', NULL, 62732, 'HLILLJ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(34, 'Highland Meadows', 'rent', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 2.0, 3, 443, 989700.00, 1, 0, 0, 8, 4, 4, 'month', 'renting', 10, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-03', 0, 1, '43.7679', '-76.6762', NULL, 95321, '498KKF', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(35, 'Brookfield Gardens', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 1.0, 16, 106, 368800.00, 1, 0, 0, 12, 6, 6, 'month', 'selling', 11, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-29', 0, 1, '43.0249', '-75.6611', NULL, 48074, 'FNNBP8', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(36, 'Silverwood Villas', 'sale', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 18, 2.0, 1.0, 9, 290, 480900.00, 1, 0, 0, 22, 10, 10, 'month', 'selling', 12, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-07-07', 0, 1, '43.2090', '-75.7793', NULL, 8591, '84FACF', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(37, 'Evergreen Terrace', 'rent', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 4.0, 18, 479, 361200.00, 1, 0, 0, 14, 7, 7, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-04-29', 0, 1, '42.7594', '-76.3351', NULL, 93358, 'L2VC99', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(38, 'Golden Gate Residences', 'sale', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 1.0, 43, 432, 846700.00, 1, 0, 0, 16, 8, 8, 'month', 'selling', 2, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-12-13', 0, 1, '43.7741', '-74.9948', NULL, 50149, 'DOCU28', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(39, 'Spring Blossom Park', 'sale', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 2.0, 26, 218, 95300.00, 1, 0, 0, 19, 9, 9, 'month', 'selling', 3, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-02-16', 0, 1, '43.8683', '-76.6844', NULL, 30323, 'F43UEB', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(40, 'Horizon Pointe', 'rent', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 2.0, 3.0, 19, 491, 531600.00, 1, 0, 0, 10, 5, 5, 'month', 'renting', 4, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-11-25', 0, 1, '43.3454', '-74.7874', NULL, 42511, 'WQ8RNW', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(41, 'Whispering Pines Lodge', 'sale', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 5, 3.0, 2.0, 4, 270, 254400.00, 1, 0, 0, 6, 3, 3, 'month', 'selling', 5, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-09', 0, 1, '43.8387', '-76.4947', NULL, 99181, 'YLNPDN', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(42, 'Sunset Ridge', 'sale', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 4.0, 35, 348, 570800.00, 1, 0, 0, 4, 2, 2, 'month', 'selling', 6, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-07-29', 0, 1, '43.4715', '-75.0615', NULL, 7881, 'RTYMEU', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(43, 'Timberline Estates', 'rent', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 1.0, 4.0, 12, 95, 780800.00, 1, 0, 0, 1, 1, 1, 'month', 'renting', 7, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-27', 0, 1, '43.1131', '-76.3667', NULL, 16827, 'FUY97A', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(44, 'Crystal Lake Condos', 'sale', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 2.0, 2, 366, 373300.00, 1, 0, 0, 8, 4, 4, 'month', 'selling', 8, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-18', 0, 1, '43.5727', '-74.7713', NULL, 17432, 'IKMOUI', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(45, 'Briarwood Apartments', 'sale', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 4.0, 35, 268, 461500.00, 1, 0, 0, 12, 6, 6, 'month', 'selling', 9, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-26', 0, 1, '42.6661', '-75.0415', NULL, 35857, 'XJNO4I', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(46, 'Summit View', 'rent', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 10, 2.0, 1.0, 19, 53, 43300.00, 1, 0, 0, 22, 10, 10, 'month', 'renting', 10, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-11-19', 0, 1, '43.2021', '-75.4482', NULL, 98443, 'C5BS01', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41');
INSERT INTO `re_properties` (`id`, `name`, `type`, `description`, `content`, `location`, `images`, `floor_plans`, `project_id`, `number_bedroom`, `number_bathroom`, `number_floor`, `square`, `price`, `currency_id`, `is_featured`, `featured_priority`, `city_id`, `state_id`, `country_id`, `period`, `status`, `author_id`, `author_type`, `moderation_status`, `reject_reason`, `expire_date`, `auto_renew`, `never_expired`, `latitude`, `longitude`, `zip_code`, `views`, `unique_id`, `private_notes`, `created_at`, `updated_at`) VALUES
(47, 'Elmwood Park', 'sale', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 1.0, 3.0, 28, 429, 965500.00, 1, 0, 0, 14, 7, 7, 'month', 'selling', 11, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-31', 0, 1, '43.0536', '-75.4992', NULL, 33860, 'MSAJO0', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(48, 'Stonegate Homes', 'sale', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 5.0, 2.0, 38, 189, 124200.00, 1, 0, 0, 16, 8, 8, 'month', 'selling', 12, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-07-25', 0, 1, '42.6441', '-75.5010', NULL, 74228, 'VWINX5', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(49, 'Rosewood Villas', 'rent', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 2.0, 2.0, 27, 168, 211300.00, 1, 0, 0, 19, 9, 9, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-06-23', 0, 1, '43.3967', '-75.1594', NULL, 29396, 'AOEOMS', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(50, 'Prairie Meadows', 'sale', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 1.0, 4.0, 19, 257, 296900.00, 1, 0, 0, 10, 5, 5, 'month', 'selling', 2, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-04-24', 0, 1, '43.8896', '-74.8815', NULL, 40641, 'ULZROP', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(51, 'Hawthorne Heights', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 15, 6.0, 2.0, 6, 160, 187400.00, 1, 0, 0, 6, 3, 3, 'month', 'selling', 3, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-12-19', 0, 1, '43.9653', '-75.5844', NULL, 80839, 'GAFIHK', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(52, 'Sierra Vista', 'rent', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '456 Maple Avenue, Downtown District', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 4.0, 2, 479, 972200.00, 1, 0, 0, 4, 2, 2, 'month', 'renting', 4, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-05-05', 0, 1, '43.0060', '-75.1665', NULL, 6788, '7ABLSB', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(53, 'Autumn Leaves', 'sale', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '789 Pine Road, Garden Quarter', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 5, 408, 338000.00, 1, 0, 0, 1, 1, 1, 'month', 'selling', 5, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-07-28', 0, 1, '43.5059', '-76.0492', NULL, 15544, 'CFUEZM', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(54, 'Blue Sky Residences', 'sale', 'Stunning property offering panoramic views and luxurious finishes. Every detail has been carefully considered in this exceptional home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '321 Cedar Lane, Lakeside Park', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 29, 361, 954900.00, 1, 0, 0, 8, 4, 4, 'month', 'selling', 6, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-09-13', 0, 1, '43.3747', '-76.7295', NULL, 29312, 'X8HS23', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(55, 'Pebble Creek', 'rent', 'Spacious and bright residence with an excellent layout for modern living. Move-in ready with all appliances included.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '654 Birch Boulevard, Sunset Hills', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 1.0, 36, 265, 243500.00, 1, 0, 0, 12, 6, 6, 'month', 'renting', 7, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-20', 0, 1, '42.7420', '-75.2613', NULL, 96245, '3JTPCQ', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(56, 'Magnolia Manor', 'sale', 'Prime real estate opportunity in a desirable neighborhood. This property combines location, quality, and value perfectly.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '987 Elm Drive, Mountain View', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 2, 4.0, 1.0, 38, 276, 427600.00, 1, 0, 0, 22, 10, 10, 'month', 'selling', 8, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-02-27', 0, 1, '43.9162', '-74.9669', NULL, 90311, 'ECYDZP', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(57, 'Cherry Blossom Estates', 'sale', 'Beautiful property featuring modern design and premium finishes throughout. This stunning home offers an open floor plan perfect for entertaining.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '147 Willow Way, Harbor Point', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 4.0, 2.0, 6, 474, 610900.00, 1, 0, 0, 14, 7, 7, 'month', 'selling', 9, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-08-26', 0, 1, '42.5215', '-75.1141', NULL, 83562, 'KUJKTR', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(58, 'Windsor Park', 'rent', 'Exceptional residence in a prime location with easy access to schools, shopping, and public transportation. Recently renovated with high-end fixtures.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '258 Spruce Court, Valley Green', '\"[\\\"properties\\/5.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 1.0, 24, 442, 586800.00, 1, 0, 0, 16, 8, 8, 'month', 'renting', 10, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-01-07', 0, 1, '43.1661', '-75.6484', NULL, 15480, '7JUQPH', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(59, 'Seaside Villas', 'sale', 'Charming property with spacious rooms and abundant natural light. The well-maintained garden adds to the appeal of this lovely home.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '369 Ash Circle, Meadow Springs', '\"[\\\"properties\\/2.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/6.jpg\\\",\\\"properties\\/8.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 3.0, 2.0, 43, 478, 832600.00, 1, 0, 0, 19, 9, 9, 'month', 'selling', 11, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-11-23', 0, 1, '43.1444', '-76.2945', NULL, 52371, '2DU9CM', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(60, 'Mountain View Retreat', 'sale', 'Contemporary living at its finest. This property boasts state-of-the-art amenities and a sleek, modern aesthetic throughout.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '741 Hickory Place, Forest Glen', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/5.jpg\\\",\\\"properties\\/7.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/11.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 0, 6.0, 1.0, 20, 121, 109200.00, 1, 0, 0, 10, 5, 5, 'month', 'selling', 12, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2027-03-03', 0, 1, '42.6082', '-74.9661', NULL, 243, '9U0I0R', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(61, 'Amberwood Apartments', 'rent', 'Elegant home with timeless architecture and thoughtful design elements. Perfect for families seeking comfort and style.', 'Welcome to this exceptional property that redefines modern living. From the moment you enter, you will be captivated by the attention to detail and quality craftsmanship evident throughout. The open-concept living area flows seamlessly into the gourmet kitchen, featuring premium appliances, quartz countertops, and custom cabinetry. Large windows flood the space with natural light while offering views of the beautifully landscaped surroundings. The primary suite is a true retreat, complete with a spa-like bathroom and generous walk-in closet. Additional bedrooms are well-appointed, perfect for family members or guests. The outdoor living space extends your entertaining options with a covered patio and mature landscaping. Located in a sought-after neighborhood with excellent schools, convenient shopping, and easy highway access, this property offers the perfect combination of comfort, style, and location.', '123 Oak Street, Riverside Heights', '\"[\\\"properties\\/1.jpg\\\",\\\"properties\\/2.jpg\\\",\\\"properties\\/3.jpg\\\",\\\"properties\\/4.jpg\\\",\\\"properties\\/9.jpg\\\",\\\"properties\\/10.jpg\\\",\\\"properties\\/11.jpg\\\",\\\"properties\\/12.jpg\\\"]\"', '\"[[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"First Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"3\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}],[{\\\"key\\\":\\\"name\\\",\\\"value\\\":\\\"Second Floor\\\"},{\\\"key\\\":\\\"bedrooms\\\",\\\"value\\\":\\\"2\\\"},{\\\"key\\\":\\\"bathrooms\\\",\\\"value\\\":\\\"1\\\"},{\\\"key\\\":\\\"image\\\",\\\"value\\\":\\\"properties\\\\\\/floor.png\\\"}]]\"', 7, 2.0, 3.0, 35, 319, 833200.00, 1, 0, 0, 6, 3, 3, 'month', 'renting', 1, 'Botble\\RealEstate\\Models\\Account', 'approved', NULL, '2026-10-07', 0, 1, '43.2574', '-76.3333', NULL, 69781, 'LMH3D9', NULL, '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(62, 'tt5t', 'sale', NULL, NULL, 'trt', '\"[\\\"properties\\\\\\/b53c87c2-6cc2-4f6b-b9b4-20e19c47f453.png\\\",\\\"properties\\\\\\/b0ab61c1-aa1e-431a-922b-1c446fe85131.jpg\\\"]\"', NULL, 0, 4.0, 2.0, 0, 160, 1500.00, NULL, 0, 0, 1, NULL, 1, 'month', 'selling', NULL, 'BotbleACLModelsUser', 'approved', NULL, NULL, 0, 0, NULL, NULL, NULL, 0, 'PROP-DUUAOT', NULL, '2026-05-13 17:46:55', '2026-05-13 19:16:11'),
(63, 'Ksld', 'sale', 'Contact phone: 0696126701\nContact email: elfakirfikri@gmail.com', NULL, '118 Rue Casablanca, Imzouren, Al Hoceima, imzouren', '\"[\\\"properties\\\\\\/bb965b9f-3b62-40a8-88db-81c8fb813d55.png\\\"]\"', NULL, 0, 5.0, 2.0, NULL, 169, 3655.00, NULL, 0, 0, NULL, NULL, 1, 'month', 'pending', 2, 'App\\Models\\User', 'rejected', NULL, NULL, 0, 0, '32.192529', '-6.945530', NULL, 0, 'USER-STBDSE', NULL, '2026-05-13 19:24:39', '2026-05-13 20:17:33'),
(64, 'lsld', 'sale', 'Contact phone: sdls\nContact email: elfakirfikri@gmail.com', NULL, '118 Rue Casablanca, Imzouren, Al Hoceima, imzouren', '\"[\\\"properties\\\\\\/9ac886f9-bcd4-4fd7-aa89-822fe5e4e1d6.png\\\"]\"', NULL, 0, 5.0, 2.0, NULL, 169, 2623.00, NULL, 1, 0, NULL, NULL, 1, 'month', 'selling', 2, 'App\\Models\\User', 'approved', NULL, NULL, 0, 0, '31.909452', '-9.010959', NULL, 0, 'USER-UCPYPS', NULL, '2026-05-13 19:48:26', '2026-05-13 20:25:41'),
(65, 'rente', 'rent', 'Contact phone: +212696126701\nContact email: elfakirfikri@gmail.com', NULL, '118 Rue Casablanca, Imzouren, Al Hoceima, imzouren', '\"[\\\"media\\\\\\/e1e49725-4a10-4869-af8d-3e920535ca3a.png\\\"]\"', NULL, 0, 2.0, 3.0, NULL, 1223, 133.00, NULL, 0, 0, NULL, NULL, 1, 'month', 'renting', 2, 'App\\Models\\User', 'approved', NULL, NULL, 0, 0, '32.073445', '-7.297092', NULL, 0, 'USER-B2AZ8L', NULL, '2026-05-14 10:52:52', '2026-05-14 10:53:41');

-- --------------------------------------------------------

--
-- Table structure for table `re_property_categories`
--

CREATE TABLE `re_property_categories` (
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_property_categories`
--

INSERT INTO `re_property_categories` (`property_id`, `category_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(3, 2),
(4, 1),
(5, 1),
(6, 1),
(6, 2),
(7, 1),
(7, 2),
(7, 3),
(8, 1),
(8, 2),
(9, 1),
(9, 2),
(9, 3),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(12, 1),
(13, 1),
(13, 2),
(14, 1),
(14, 2),
(15, 1),
(15, 2),
(15, 3),
(16, 1),
(16, 2),
(17, 1),
(17, 2),
(18, 1),
(18, 2),
(18, 3),
(19, 1),
(20, 1),
(20, 2),
(20, 3),
(21, 1),
(21, 2),
(21, 3),
(22, 1),
(22, 2),
(22, 3),
(23, 1),
(23, 2),
(23, 3),
(24, 1),
(24, 2),
(24, 3),
(25, 1),
(25, 2),
(26, 1),
(26, 2),
(27, 1),
(28, 1),
(28, 2),
(29, 1),
(29, 2),
(30, 1),
(31, 1),
(31, 2),
(31, 3),
(32, 1),
(32, 2),
(32, 3),
(33, 1),
(33, 2),
(34, 1),
(34, 2),
(35, 1),
(35, 2),
(35, 3),
(36, 1),
(36, 2),
(37, 1),
(38, 1),
(38, 2),
(38, 3),
(39, 1),
(40, 1),
(40, 2),
(40, 3),
(41, 1),
(41, 2),
(41, 3),
(42, 1),
(42, 2),
(42, 3),
(43, 1),
(43, 2),
(44, 1),
(44, 2),
(44, 3),
(45, 1),
(45, 2),
(46, 1),
(46, 2),
(47, 1),
(47, 2),
(47, 3),
(48, 1),
(48, 2),
(48, 3),
(49, 1),
(50, 1),
(50, 2),
(51, 1),
(51, 2),
(52, 1),
(52, 2),
(52, 3),
(53, 1),
(53, 2),
(54, 1),
(54, 2),
(54, 3),
(55, 1),
(56, 1),
(57, 1),
(57, 2),
(57, 3),
(58, 1),
(58, 2),
(59, 1),
(60, 1),
(60, 2),
(61, 1),
(61, 2),
(61, 3),
(62, 1),
(62, 5),
(62, 6);

-- --------------------------------------------------------

--
-- Table structure for table `re_property_features`
--

CREATE TABLE `re_property_features` (
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `feature_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `re_property_features`
--

INSERT INTO `re_property_features` (`property_id`, `feature_id`) VALUES
(1, 1),
(1, 3),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 11),
(1, 12),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 10),
(2, 11),
(2, 12),
(3, 3),
(3, 5),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(4, 2),
(4, 4),
(4, 6),
(4, 8),
(4, 10),
(4, 11),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 7),
(5, 11),
(5, 12),
(6, 1),
(6, 2),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(6, 9),
(6, 10),
(6, 11),
(7, 1),
(7, 2),
(7, 4),
(7, 6),
(7, 7),
(7, 8),
(7, 9),
(7, 10),
(7, 11),
(7, 12),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 6),
(8, 8),
(8, 9),
(8, 10),
(8, 11),
(8, 12),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(9, 5),
(9, 6),
(9, 9),
(9, 10),
(9, 11),
(9, 12),
(10, 1),
(10, 2),
(10, 4),
(10, 5),
(10, 6),
(10, 7),
(10, 8),
(10, 9),
(10, 11),
(10, 12),
(11, 1),
(11, 2),
(11, 4),
(11, 6),
(11, 7),
(11, 9),
(11, 12),
(12, 1),
(12, 2),
(12, 4),
(12, 5),
(12, 6),
(12, 7),
(12, 8),
(12, 10),
(12, 11),
(12, 12),
(13, 2),
(13, 3),
(13, 4),
(13, 7),
(13, 9),
(13, 10),
(13, 11),
(14, 1),
(14, 7),
(14, 8),
(14, 10),
(14, 12),
(15, 1),
(15, 2),
(15, 5),
(15, 6),
(15, 7),
(15, 8),
(15, 11),
(15, 12),
(16, 1),
(16, 5),
(16, 6),
(16, 7),
(16, 8),
(16, 9),
(16, 10),
(16, 11),
(16, 12),
(17, 2),
(17, 3),
(17, 4),
(17, 5),
(17, 6),
(17, 8),
(17, 9),
(17, 10),
(17, 11),
(17, 12),
(18, 1),
(18, 2),
(18, 4),
(18, 5),
(18, 6),
(18, 9),
(18, 12),
(19, 1),
(19, 3),
(19, 5),
(19, 6),
(19, 8),
(20, 1),
(20, 6),
(20, 7),
(20, 8),
(21, 2),
(21, 5),
(21, 6),
(21, 7),
(21, 8),
(21, 9),
(22, 6),
(22, 9),
(22, 10),
(22, 11),
(23, 1),
(23, 2),
(23, 3),
(23, 4),
(23, 5),
(23, 7),
(23, 9),
(23, 10),
(23, 11),
(23, 12),
(24, 1),
(24, 3),
(24, 5),
(24, 6),
(24, 7),
(24, 8),
(24, 10),
(24, 12),
(25, 2),
(25, 3),
(25, 4),
(25, 11),
(26, 2),
(26, 5),
(26, 7),
(26, 9),
(27, 7),
(27, 8),
(27, 9),
(27, 11),
(28, 1),
(28, 4),
(28, 7),
(28, 8),
(28, 10),
(28, 11),
(28, 12),
(29, 1),
(29, 4),
(29, 7),
(29, 8),
(29, 12),
(30, 3),
(30, 7),
(30, 8),
(30, 10),
(31, 2),
(31, 4),
(31, 5),
(31, 6),
(31, 7),
(31, 9),
(31, 10),
(31, 12),
(32, 1),
(32, 2),
(32, 3),
(32, 5),
(32, 6),
(32, 8),
(32, 11),
(32, 12),
(33, 3),
(33, 4),
(33, 5),
(33, 6),
(33, 7),
(33, 8),
(33, 9),
(33, 11),
(33, 12),
(34, 1),
(34, 2),
(34, 3),
(34, 4),
(34, 5),
(34, 7),
(34, 8),
(34, 9),
(34, 11),
(34, 12),
(35, 2),
(35, 3),
(35, 4),
(35, 5),
(35, 6),
(35, 7),
(35, 8),
(35, 9),
(35, 11),
(35, 12),
(36, 3),
(36, 4),
(36, 5),
(36, 8),
(36, 10),
(36, 11),
(36, 12),
(37, 1),
(37, 2),
(37, 4),
(37, 6),
(37, 7),
(37, 8),
(37, 9),
(37, 10),
(37, 11),
(37, 12),
(38, 1),
(38, 3),
(38, 6),
(38, 8),
(38, 9),
(38, 12),
(39, 1),
(39, 2),
(39, 3),
(39, 5),
(39, 8),
(39, 9),
(39, 10),
(39, 11),
(39, 12),
(40, 1),
(40, 3),
(40, 5),
(40, 7),
(40, 8),
(40, 9),
(40, 12),
(41, 3),
(41, 6),
(41, 7),
(41, 8),
(42, 1),
(42, 7),
(42, 8),
(42, 9),
(43, 1),
(43, 2),
(43, 4),
(43, 5),
(43, 7),
(43, 8),
(43, 9),
(43, 10),
(43, 11),
(43, 12),
(44, 3),
(44, 5),
(44, 6),
(44, 8),
(44, 9),
(44, 10),
(44, 11),
(44, 12),
(45, 4),
(45, 8),
(45, 9),
(45, 10),
(45, 11),
(46, 1),
(46, 2),
(46, 4),
(46, 5),
(46, 6),
(46, 7),
(46, 9),
(46, 10),
(46, 11),
(46, 12),
(47, 1),
(47, 2),
(47, 4),
(47, 5),
(47, 6),
(47, 7),
(47, 8),
(47, 10),
(47, 11),
(47, 12),
(48, 1),
(48, 3),
(48, 4),
(48, 6),
(48, 10),
(48, 11),
(49, 1),
(49, 7),
(49, 10),
(49, 12),
(50, 1),
(50, 2),
(50, 3),
(50, 4),
(50, 6),
(50, 9),
(51, 1),
(51, 3),
(51, 6),
(51, 8),
(51, 11),
(52, 1),
(52, 2),
(52, 4),
(52, 6),
(52, 7),
(53, 3),
(53, 5),
(53, 8),
(53, 12),
(54, 2),
(54, 3),
(54, 4),
(54, 8),
(54, 11),
(55, 1),
(55, 4),
(55, 6),
(55, 7),
(55, 8),
(56, 1),
(56, 3),
(56, 6),
(56, 9),
(56, 11),
(56, 12),
(57, 2),
(57, 3),
(57, 4),
(57, 5),
(57, 7),
(57, 8),
(57, 9),
(57, 10),
(57, 11),
(57, 12),
(58, 1),
(58, 3),
(58, 5),
(58, 6),
(58, 7),
(58, 8),
(58, 9),
(58, 10),
(58, 11),
(58, 12),
(59, 1),
(59, 2),
(59, 4),
(59, 5),
(59, 6),
(59, 7),
(59, 9),
(59, 11),
(60, 5),
(60, 7),
(60, 9),
(60, 10),
(61, 1),
(61, 2),
(61, 4),
(61, 5),
(61, 6),
(61, 7),
(61, 9),
(61, 10),
(61, 11),
(62, 12);

-- --------------------------------------------------------

--
-- Table structure for table `re_reviews`
--

CREATE TABLE `re_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `reviewable_type` varchar(255) NOT NULL,
  `reviewable_id` bigint(20) UNSIGNED NOT NULL,
  `star` tinyint(4) NOT NULL,
  `content` varchar(500) NOT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(120) NOT NULL,
  `value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Mahalo', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(2, 'tagline', 'Morocco\'s Most Trusted Real Estate Platform', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(3, 'contact_email', 'contact@mahalo.ma', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(4, 'contact_phone', '+212 600 000 000', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(5, 'address', 'Casablanca, Morocco', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(6, 'whatsapp_number', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(7, 'facebook_url', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(8, 'instagram_url', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(9, 'twitter_url', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(10, 'youtube_url', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(11, 'seo_title', 'Mahalo — Immobilier de luxe au Maroc', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(12, 'seo_description', 'Find your dream property in Morocco with Mahalo. Browse thousands of verified listings across Casablanca, Marrakech, Rabat and more.', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(13, 'google_analytics_id', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(14, 'currency', 'MAD', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(15, 'properties_per_page', '12', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(16, 'primary_color', '#000000', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(17, 'secondary_color', '#730D26', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(18, 'accent_color', '#F5F5F5', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(19, 'logo_url', '/logo.png', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(20, 'footer_logo_url', '/logo-light.png', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(21, 'watermark_enabled', '1', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(22, 'watermark_logo_url', 'https://blueviolet-newt-360669.hostingersite.com/storage/logos/a8e78dec-a333-4761-8214-edb2be03652f.png', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(23, 'watermark_position', 'center', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(24, 'watermark_opacity', '100', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(25, 'watermark_size', '50', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(26, 'mail_mailer', 'smtp', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(27, 'mail_host', 'smtp.hostinger.com', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(28, 'mail_port', '465', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(29, 'mail_username', 'jaw@nekkour.com', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(30, 'mail_password', '7qF6HK9$Es', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(31, 'mail_encryption', 'ssl', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(32, 'mail_from_address', 'jaw@nekkour.com', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(33, 'mail_from_name', 'Mahalo', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(34, 'google_client_id', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18'),
(35, 'google_client_secret', '', '2026-05-14 11:39:18', '2026-05-14 11:39:18');

-- --------------------------------------------------------

--
-- Table structure for table `slugs`
--

CREATE TABLE `slugs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `reference_id` bigint(20) UNSIGNED NOT NULL,
  `reference_type` varchar(255) NOT NULL,
  `prefix` varchar(120) NOT NULL DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slugs`
--

INSERT INTO `slugs` (`id`, `key`, `reference_id`, `reference_type`, `prefix`, `created_at`, `updated_at`) VALUES
(13, 'apartment', 1, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(14, 'villa', 2, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(15, 'condo', 3, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(16, 'house', 4, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(17, 'land', 5, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(18, 'commercial-property', 6, 'Botble\\RealEstate\\Models\\Category', 'property-category', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(19, 'walnut-park-apartments', 1, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(20, 'sunshine-wonder-villas', 2, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(21, 'diamond-island', 3, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(22, 'the-nassim', 4, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(23, 'vinhomes-grand-park', 5, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(24, 'the-metropole-thu-thiem', 6, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(25, 'villa-on-grand-avenue', 7, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(26, 'traditional-food-restaurant', 8, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(27, 'villa-on-hollywood-boulevard', 9, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(28, 'office-space-at-northwest-107th', 10, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(29, 'home-in-merrick-way', 11, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(30, 'adarsh-greens', 12, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:40', '2026-05-12 19:43:40'),
(31, 'rustomjee-evershine-global-city', 13, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(32, 'godrej-exquisite', 14, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(33, 'godrej-prime', 15, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(34, 'ps-panache', 16, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(35, 'upturn-atmiya-centria', 17, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(36, 'brigade-oasis', 18, 'Botble\\RealEstate\\Models\\Project', 'projects', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(37, '3-beds-villa-calpe-alicante', 1, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(38, 'lavida-plus-office-tel-1-bedroom', 2, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(39, 'vinhomes-grand-park-studio-1-bedroom', 3, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(40, 'the-sun-avenue-office-tel-1-bedroom', 4, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(41, 'property-for-sale-johannesburg-south-africa', 5, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(42, 'stunning-french-inspired-manor', 6, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(43, 'villa-for-sale-at-bermuda-dunes', 7, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(44, 'walnut-park-apartment', 8, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(45, '5-beds-luxury-house', 9, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(46, 'family-victorian-view-home', 10, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(47, 'osaka-heights-apartment', 11, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(48, 'private-estate-magnificent-views', 12, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(49, 'thompson-road-house-for-rent', 13, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(50, 'brand-new-1-bedroom-apartment-in-first-class-location', 14, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(51, 'elegant-family-home-presents-premium-modern-living', 15, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(52, 'luxury-apartments-in-singapore-for-sale', 16, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(53, '5-room-luxury-penthouse-for-sale-in-kuala-lumpur', 17, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(54, '2-floor-house-in-compound-pejaten-barat-kemang', 18, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(55, 'apartment-muiderstraatweg-in-diemen', 19, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(56, 'nice-apartment-for-rent-in-berlin', 20, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(57, 'pumpkin-key-private-island', 21, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(58, 'maplewood-estates', 22, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(59, 'pine-ridge-manor', 23, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(60, 'oak-hill-residences', 24, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(61, 'sunnybrook-villas', 25, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(62, 'riverstone-condominiums', 26, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(63, 'cedar-park-apartments', 27, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(64, 'lakeside-retreat', 28, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(65, 'willow-creek-homes', 29, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(66, 'grandview-heights', 30, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(67, 'forest-glen-cottages', 31, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(68, 'harborview-towers', 32, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(69, 'meadowlands-estates', 33, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(70, 'highland-meadows', 34, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(71, 'brookfield-gardens', 35, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(72, 'silverwood-villas', 36, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(73, 'evergreen-terrace', 37, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(74, 'golden-gate-residences', 38, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(75, 'spring-blossom-park', 39, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(76, 'horizon-pointe', 40, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(77, 'whispering-pines-lodge', 41, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(78, 'sunset-ridge', 42, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(79, 'timberline-estates', 43, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(80, 'crystal-lake-condos', 44, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(81, 'briarwood-apartments', 45, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(82, 'summit-view', 46, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(83, 'elmwood-park', 47, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(84, 'stonegate-homes', 48, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(85, 'rosewood-villas', 49, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(86, 'prairie-meadows', 50, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(87, 'hawthorne-heights', 51, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(88, 'sierra-vista', 52, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(89, 'autumn-leaves', 53, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(90, 'blue-sky-residences', 54, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(91, 'pebble-creek', 55, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(92, 'magnolia-manor', 56, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(93, 'cherry-blossom-estates', 57, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(94, 'windsor-park', 58, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(95, 'seaside-villas', 59, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(96, 'mountain-view-retreat', 60, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(97, 'amberwood-apartments', 61, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(98, 'tt5t-62', 62, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-13 17:46:55', '2026-05-13 17:46:55'),
(99, 'fikri-el-fakir-63', 63, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-13 19:24:39', '2026-05-13 19:24:39'),
(100, 'lsld-64', 64, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-13 19:48:26', '2026-05-13 19:48:26'),
(101, 'fikri-el-fakir-65', 65, 'Botble\\RealEstate\\Models\\Property', 'properties', '2026-05-14 10:52:52', '2026-05-14 10:52:52');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `abbreviation` varchar(10) DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_default` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `slug`, `abbreviation`, `country_id`, `order`, `image`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(1, 'France', 'france', 'FR', 1, 0, 'locations/5.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(2, 'England', 'england', 'EN', 2, 0, 'locations/3.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(3, 'New York', 'new-york', 'NY', 3, 0, 'locations/4.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(4, 'Holland', 'holland', 'HL', 4, 0, 'locations/3.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(5, 'Denmark', 'denmark', 'DN', 5, 0, 'locations/5.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(6, 'Bavaria', 'bavaria', 'BY', 6, 0, 'locations/3.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(7, 'Tokyo', 'tokyo', 'TK', 7, 0, 'locations/4.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(8, 'Ontario', 'ontario', 'ON', 8, 0, 'locations/4.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(9, 'New South Wales', 'new-south-wales', 'NSW', 9, 0, 'locations/3.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38'),
(10, 'Lombardy', 'lombardy', 'LO', 10, 0, 'locations/4.jpg', 0, 'published', '2026-05-12 19:43:38', '2026-05-12 19:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `company` varchar(120) DEFAULT NULL,
  `status` varchar(60) NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `content`, `image`, `company`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Jennifer Lee', 'From the initial consultation to closing day, the real estate team went above and beyond to ensure I found the perfect home. Their dedication and professionalism made the entire process seamless. Thank you!', 'avatars/4.jpg', 'Happy Home Seeker', 'published', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(2, 'Robert Evans', 'I am impressed by the level of expertise and commitment demonstrated by this real estate team. Their insights into the market helped me make informed investment decisions, and I couldn\'t be happier with the results.', 'avatars/6.jpg', 'Property Investor', 'published', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(3, 'Jessica White', 'Selling my home with the help of this real estate team was a breeze. They provided valuable advice, staged my property beautifully, and negotiated a great deal. I highly recommend their services to anyone looking to sell their home!', 'avatars/5.jpg', 'Delighted Home Seller', 'published', '2026-05-12 19:43:41', '2026-05-12 19:43:41'),
(4, 'Daniel Miller', 'Thanks to the expertise and guidance of this real estate team, I am now the proud owner of my dream home. They listened to my preferences, answered all my questions, and made the entire home buying process a positive experience.', 'avatars/11.jpg', 'Happy New Homeowner', 'published', '2026-05-12 19:43:41', '2026-05-12 19:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `account_type` varchar(255) NOT NULL DEFAULT 'individual',
  `company_name` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `professional_status` varchar(255) DEFAULT NULL,
  `professional_bio` text DEFAULT NULL,
  `professional_specialty` varchar(255) DEFAULT NULL,
  `professional_experience_years` tinyint(3) UNSIGNED DEFAULT NULL,
  `professional_phone` varchar(255) DEFAULT NULL,
  `professional_city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `professional_applied_at` timestamp NULL DEFAULT NULL,
  `professional_reject_reason` varchar(255) DEFAULT NULL,
  `professional_agent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'viewer',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `account_type`, `company_name`, `license_number`, `professional_status`, `professional_bio`, `professional_specialty`, `professional_experience_years`, `professional_phone`, `professional_city_id`, `professional_applied_at`, `professional_reject_reason`, `professional_agent_id`, `role`, `email_verified_at`, `password`, `remember_token`, `google_id`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@mahalo.ma', NULL, 'individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', '2026-05-12 19:43:38', '$2y$12$F4WiuTr7gd43N03AXWlI8eb9R2of482biDk929bhKb3BTPvq9pMJu', NULL, NULL, '2026-05-12 19:43:38', '2026-05-13 19:53:49'),
(2, 'fikri', 'elfakirfikri@gmail.com', '0696126701', 'individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', NULL, '$2y$12$Xc8u03nAzw5C.1v96GJJP.dVg8ecjIBxL8KUZl929mVmYxEaT.Tmq', NULL, NULL, '2026-05-13 17:35:38', '2026-05-13 17:35:38'),
(6, 'playmagnes@gmail.com', 'playmagnes@gmail.com', '0696126701', 'individual', 'MAhalo ls', '2024556a5', 'pending', 'kslajishioshaoiushouishaiuhashoaihsaushuasgausausg', 'Commercial Real Estate', 3, '+212696126701', NULL, '2026-05-14 12:21:37', NULL, NULL, 'user', '2026-05-14 12:11:13', '$2y$12$.eHO/v7RGABULb8PJ7gDEel1v/0XNQtKJpkBXjixNgdFPBGaBsfzC', NULL, NULL, '2026-05-14 12:11:13', '2026-05-14 12:21:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_slug_unique` (`slug`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorites_user_id_property_id_unique` (`user_id`,`property_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `re_accounts`
--
ALTER TABLE `re_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `re_accounts_email_unique` (`email`),
  ADD UNIQUE KEY `re_accounts_username_unique` (`username`);

--
-- Indexes for table `re_categories`
--
ALTER TABLE `re_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_consults`
--
ALTER TABLE `re_consults`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_currencies`
--
ALTER TABLE `re_currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_facilities`
--
ALTER TABLE `re_facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_facilities_distances`
--
ALTER TABLE `re_facilities_distances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `re_facilities_distances_reference_type_reference_id_index` (`reference_type`,`reference_id`);

--
-- Indexes for table `re_features`
--
ALTER TABLE `re_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_investors`
--
ALTER TABLE `re_investors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_packages`
--
ALTER TABLE `re_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `re_projects`
--
ALTER TABLE `re_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `re_projects_unique_id_unique` (`unique_id`),
  ADD KEY `re_projects_status_index` (`status`);

--
-- Indexes for table `re_project_categories`
--
ALTER TABLE `re_project_categories`
  ADD PRIMARY KEY (`project_id`,`category_id`);

--
-- Indexes for table `re_properties`
--
ALTER TABLE `re_properties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `re_properties_unique_id_unique` (`unique_id`),
  ADD KEY `re_properties_status_index` (`status`),
  ADD KEY `re_properties_moderation_status_index` (`moderation_status`),
  ADD KEY `re_properties_type_index` (`type`);

--
-- Indexes for table `re_property_categories`
--
ALTER TABLE `re_property_categories`
  ADD PRIMARY KEY (`property_id`,`category_id`);

--
-- Indexes for table `re_property_features`
--
ALTER TABLE `re_property_features`
  ADD KEY `re_property_features_property_id_index` (`property_id`),
  ADD KEY `re_property_features_feature_id_index` (`feature_id`);

--
-- Indexes for table `re_reviews`
--
ALTER TABLE `re_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `re_reviews_reviewable_type_reviewable_id_index` (`reviewable_type`,`reviewable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

--
-- Indexes for table `slugs`
--
ALTER TABLE `slugs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slugs_reference_id_reference_type_index` (`reference_id`,`reference_type`),
  ADD KEY `slugs_key_prefix_index` (`key`,`prefix`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `states_slug_unique` (`slug`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_google_id_unique` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `re_accounts`
--
ALTER TABLE `re_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `re_categories`
--
ALTER TABLE `re_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `re_consults`
--
ALTER TABLE `re_consults`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `re_currencies`
--
ALTER TABLE `re_currencies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `re_facilities`
--
ALTER TABLE `re_facilities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `re_facilities_distances`
--
ALTER TABLE `re_facilities_distances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=870;

--
-- AUTO_INCREMENT for table `re_features`
--
ALTER TABLE `re_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `re_investors`
--
ALTER TABLE `re_investors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `re_packages`
--
ALTER TABLE `re_packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `re_projects`
--
ALTER TABLE `re_projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `re_properties`
--
ALTER TABLE `re_properties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `re_reviews`
--
ALTER TABLE `re_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `slugs`
--
ALTER TABLE `slugs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
