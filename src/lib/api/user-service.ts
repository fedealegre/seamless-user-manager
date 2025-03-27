
import { apiService } from "./index";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

// Mock data for users
const mockUsers: User[] = [
{id: 827, name: 'Wilson Ricardo', surname: 'Guarin Nava', email: 'wilson.guarin@globant.com', gender: 'M', cellPhone: '573132615186', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Junior! 🥳👨‍👩‍👧👨🏻‍💻⚽🥏🏕️🏖️', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Ingresos del mercado de valores', tyc_gpdpr: 'true', pin_authentication_time: '1732208108119', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '366', work_area: 'Construcción', liveness_authentication_time: '1732208408119', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Proyectos personales', onboard_data: '{ "name": "WILSON RICARDO", "surname": "GUARIN NAVA"}', account_state: 'ENABLED'}},
{id: 830, name: '0455440854', cellPhone: '5491132500950', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Marian 🦋', tyc_gpdpr: 'false', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 831, name: '4928559875', cellPhone: '34670392532', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Isa', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732221641749', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 832, name: '2590880685', cellPhone: '34670392532', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Isa', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732221982970', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 834, name: '7719467959', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732565039186', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 837, name: '3062709716', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732567039247', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 838, name: '1667013346', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732567909148', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 840, name: 'Isabel', surname: 'Tovar Pozo', cellPhone: '50672476094', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Carmen Torres', liveness_authentication_time: '1732628387054', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "ISABEL", "surname": "TOVAR POZO"}', pin_authentication_time: '1732628087054', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '480'}},
{id: 848, name: 'Jose Leopoldo', surname: 'Pedregal Forte', cellPhone: '34744487047', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Pepe Pedregal', liveness_authentication_time: '1732810695754', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "JOSE LEOPOLDO", "surname": "PEDREGAL FORTE"}', pin_authentication_time: '1732810395755', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '555'}},
{id: 896, name: '8277533448', cellPhone: '5491167923337', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Martín', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1734103385483', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 900, name: '2460379359', cellPhone: '5491168742488', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Andres', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1734109697744', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 934, name: 'LISBETH CAROLINA', surname: 'MORENO VELASQUEZ', email: 'lisbeth.moreno@globant.com', gender: 'F', cellPhone: '573182518023', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Lis🍁', dubious_behaviour: '', occupation: 'Actualmente desempleado/a', silbo_use: 'Actividades profesionales', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Ventas de activos', tyc_gpdpr: 'true', pin_authentication_time: '1740773211575', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: ''}},
{id: 935, name: '9036621637', cellPhone: '5491169595622', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Yonathan Duran', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1734636113292', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 962, name: '8555070600', cellPhone: '5492494380393', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Eze Mestelan', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1736798067344', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 992, name: '9755610600', cellPhone: '5493516621057', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Tati Cuffia', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740147003861', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 997, name: 'FEDERICO', surname: 'AON RATTO', email: 'faonratto@yahoo.com', gender: 'M', cellPhone: '5491166604243', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Federico Aon Ratto', dubious_behaviour: '', occupation: 'Empleado/a', silbo_use: 'Gastos cotidianos', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1740419875543', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: 'Educación y ciencia'}},
{id: 1010, name: '3347716073', cellPhone: '56962390054', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740574196543', last_channel_used: '85C0E890-8557-4BFC-AFEE-65967B2594C1', account_state: 'ENABLED'}},
{id: 1012, name: '5384486941', cellPhone: '34640056027', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Manuel💸', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740580228383', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1016, name: 'WILSON RICARDO', surname: 'GUARIN NAVA', email: 'wilson.guarin@globant.com', gender: 'M', cellPhone: '573132615186', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Junior! 🥳👨‍👩‍👧👨🏻‍💻⚽🥏🏕️🏖️', occupation: 'Estudiante', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Pensión', tyc_gpdpr: 'true', pin_authentication_time: '1741017771455', last_channel_used: 'Silbo-Waasabi-QA', work_area: '', liveness_authentication_time: '', dubious_behaviour: '', silbo_use: 'Gastos cotidianos', account_state: 'ENABLED'}},
{id: 1021, name: '1924601842', cellPhone: '34695705994', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Jorge', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740586139650', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1022, name: 'MANUEL', surname: 'ORTEGA HUELIN', email: 'manuel.ortega@globant.com', gender: 'M', cellPhone: '34651551978', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Manolo', dubious_behaviour: '', occupation: 'Actualmente desempleado/a', silbo_use: 'Compra online y comercio electrónico', email_verification_code: '{ "verified": false, "code": "$2a$12$wvtM0y9lry068bI6p3W7v.WMp7Bsh03fm08HM9YvkcxkKD65NkGny", "expiration": 1742334211766}', income_source: 'Donaciones', tyc_gpdpr: 'true', pin_authentication_time: '1740586462786', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: ''}},
{id: 1023, name: 'JUAN CARLOS', surname: 'DIAZ CORDERO', email: 'juanky2513@gmail.com', gender: 'M', cellPhone: '34602509047', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Juan Carlos Diaz', dubious_behaviour: '', occupation: 'Estudiante', silbo_use: 'Gastos cotidianos', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Prestaciones del gobierno', tyc_gpdpr: 'true', pin_authentication_time: '1741859868581', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: ''}},
{id: 1024, name: 'MARIA', surname: 'LUENGO GARCIA', email: 'mluengogarcia@gmail.com', gender: 'F', cellPhone: '34699033376', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'MLuengo', dubious_behaviour: '', occupation: 'Empleado/a', silbo_use: 'Gastos cotidianos', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1740586444633', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: 'Medios, tecnología y consultoría'}},
{id: 1025, name: '4808148578', cellPhone: '573042419112', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Lisbeth Moreno', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740588297307', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1026, name: '2309368808', cellPhone: '34603752218', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Melissa', tyc_gpdpr: 'true', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1027, name: 'SARA', surname: 'CUELLAR ORTUÑO', email: 'cuellarortunosara@gmail.com', gender: 'F', cellPhone: '34698318934', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sara', dubious_behaviour: '', occupation: 'Estudiante', silbo_use: 'Gastos cotidianos', income_source: 'Ingresos familiares', tyc_gpdpr: 'true', pin_authentication_time: '1740589005038', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', work_area: ''}},
{id: 1029, name: 'Iker', surname: 'Gomez Garcia', cellPhone: '34684280200', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Iker', liveness_authentication_time: '1741172626304', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "IKER", "surname": "GOMEZ GARCIA"}', pin_authentication_time: '1741172326304', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '47100e7433e04eb7bcc405f20e47f8f7'}},
{id: 1031, name: '6350517102', cellPhone: '56962390040', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'C', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740620615777', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1036, name: '9154687623', cellPhone: '34686035698', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'María Fernanda Cáceres', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740649931489', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1037, name: 'Irene', surname: 'Cuenca Fernandez', email: 'irenecuenca@hotmail.es', gender: 'F', cellPhone: '34665911937', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Irene', occupation: 'Estudiante', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1740650245240', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: 'e2dd970ffd0243b3b9629bba5f1ae7a0', work_area: '', liveness_authentication_time: '1740650545240', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "IRENE", "surname": "CUENCA FERNANDEZ"}', account_state: 'ENABLED'}},
{id: 1040, name: 'Nicolas Adrian', surname: 'Gonzalez Garcia', email: 'nglezdf@gmail.com', gender: 'M', cellPhone: '34644903771', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Nico', occupation: 'Estudiante', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1740657105753', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '07a1610fbe194f2ca120e56d72911c7a', work_area: '', liveness_authentication_time: '1740657405753', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "NICOLAS ADRIAN", "surname": "GONZALEZ GARCIA"}', account_state: 'ENABLED'}},
{id: 1042, name: '3178519037', cellPhone: '34642682912', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Belén', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740663233053', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1043, name: '4980988845', cellPhone: '34679155455', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Lourdes', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1740663194562', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1046, name: '0451422137', cellPhone: '573132615186', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Junior! 🥳👨‍👩‍👧👨🏻‍💻⚽🥏🏕️🏖️', liveness_authentication_time: '', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1741017874725', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1047, name: '0689165068', cellPhone: '34680565382', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Landa😃', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1741098335290', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1049, name: 'Luis', surname: 'Cantero Perez Pedrero', email: 'lpanthero@gmail.com', gender: 'M', cellPhone: '34661888994', deleted: false, blocked: false, additionalInfo: {newsletter: 'true', whatsapp_profile_name: 'Luis C (Silbo Money)', occupation: 'Actualmente desempleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Ventas de activos', tyc_gpdpr: 'true', pin_authentication_time: '1742544855306', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '50f09a4de63c46d78658b27da2be360f', work_area: '', liveness_authentication_time: '', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Actividades profesionales', onboard_data: '{ "name": "LUIS", "surname": "CANTERO PEREZ PEDRERO"}', account_state: 'ENABLED'}},
{id: 1050, name: '4067109665', cellPhone: '34610029798', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Andres Barrios', tyc_gpdpr: 'false', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1051, name: 'Diana Catalina', surname: 'Borbon Gomez', cellPhone: '34667803476', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Catalina Borbon', liveness_authentication_time: '1741164377747', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "DIANA CATALINA", "surname": "BORBON GOMEZ"}', pin_authentication_time: '1741164077747', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '9fc644a0408947a08b9ae2b0d438cd78'}},
{id: 1058, name: '2205067975', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1741873225674', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1063, name: 'Wilson Ricardo', surname: 'Guarin Nava', email: 'wilson.guarin@globant.com', gender: 'M', cellPhone: '573132615186', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Junior! 🥳👨‍👩‍👧👨🏻‍💻⚽🥏🏕️🏖️', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1742591912923', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '2240', work_area: 'Medios, tecnología y consultoría', liveness_authentication_time: '', dubious_behaviour: '', liveness_authenticated: 'true', recover_pin_code: '{ "verified": true, "code": "null", "expiration": 0}', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "WILSON RICARDO", "surname": "GUARIN NAVA"}', account_state: 'ENABLED'}},
{id: 1070, name: 'Sandra', surname: 'Huerga Gomez', email: 'sandrahuerga@gmail.com', gender: 'F', cellPhone: '34687202988', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sandra H.', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de alquiler', tyc_gpdpr: 'true', pin_authentication_time: '1743082720851', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '2dfd463a11d8458f885310585575f847', work_area: 'Agricultura, ganadería, silvicultura y pesca', liveness_authentication_time: '1742499980279', dubious_behaviour: '', liveness_authenticated: 'true', recover_pin_code: '{ "verified": true, "code": "null", "expiration": 0}', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "SANDRA", "surname": "HUERGA GOMEZ"}', account_state: 'ENABLED'}},
{id: 1073, name: '3280502173', cellPhone: '573103340181', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Leidy Bolaños', tyc_gpdpr: 'true', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
{id: 1075, name: 'Isabel', surname: 'Tovar Pozo', email: 'isabel.tovar@silbo.money', gender: 'F', cellPhone: '34670392532', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Isa Tovar', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Rentas de trabajo', tyc_gpdpr: 'true', pin_authentication_time: '1743030728105', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: 'd6628ac3b80b4da19fac1af7925cfd29', work_area: 'Actividades financieras y seguros', liveness_authentication_time: '1743029020296', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "ISABEL", "surname": "TOVAR POZO"}', account_state: 'ENABLED'}},
{id: 1076, name: 'Jose Leopoldo', surname: 'Pedregal Forte', email: 'pppedregal@gmail.com', gender: 'M', cellPhone: '34744487047', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Pepe', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Donaciones', tyc_gpdpr: 'true', pin_authentication_time: '1743067586287', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '09239261e62541c7b8970e2c8ba1aa38', work_area: 'Agencias de viajes e inmobiliarias', liveness_authentication_time: '1743067314700', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "JOSE LEOPOLDO", "surname": "PEDREGAL FORTE"}', account_state: 'ENABLED'}},
{id: 1077, name: 'Adriana Marcela', surname: 'Vera Bustillo', email: 'adrianavera891@gmail.com', gender: 'F', cellPhone: '34610043241', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Adriana Vera', occupation: 'Estudiante', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Ingresos familiares', tyc_gpdpr: 'true', pin_authentication_time: '1743068134446', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '972a250ec2e544a0a82ab5bbefa0a365', work_area: '', liveness_authentication_time: '1743068119490', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Gastos cotidianos', onboard_data: '{ "name": "ADRIANA MARCELA", "surname": "VERA BUSTILLO"}', account_state: 'ENABLED'}}
];

// Mock wallets data
const mockWallets: { [userId: number]: Wallet[] } = {
  827: [
    {
      id: 101,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 1250.75,
      availableBalance: 1200.50,
      additionalInfo: { "walletType": "PRIMARY" }
    },
    {
      id: 102,
      companyId: 1,
      status: "ACTIVE",
      currency: "EUR",
      balance: 850.25,
      availableBalance: 850.25,
      additionalInfo: { "walletType": "SECONDARY" }
    }
  ],
  830: [
    {
      id: 201,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 520.30,
      availableBalance: 520.30,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ],
  848: [
    {
      id: 301,
      companyId: 1,
      status: "BLOCKED",
      currency: "GBP",
      balance: 0,
      availableBalance: 0,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ]
};

// Mock transactions data
const mockTransactions: { [walletId: number]: Transaction[] } = {
  101: [
    {
      transactionId: "tx_10001",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 500,
      currency: "USD",
      reference: "Salary payment"
    },
    {
      transactionId: "tx_10002",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "completed",
      type: "withdrawal",
      amount: 150,
      currency: "USD",
      reference: "ATM withdrawal"
    },
    {
      transactionId: "tx_10003",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "completed",
      type: "transfer",
      amount: 200,
      currency: "USD",
      reference: "Transfer to savings"
    }
  ],
  102: [
    {
      transactionId: "tx_20001",
      customerId: "827",
      walletId: "102",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      status: "completed",
      type: "deposit",
      amount: 600,
      currency: "EUR",
      reference: "Foreign income"
    },
    {
      transactionId: "tx_20002",
      customerId: "827",
      walletId: "102",
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      status: "pending",
      type: "withdrawal",
      amount: 50,
      currency: "EUR",
      reference: "Online purchase"
    }
  ],
  201: [
    {
      transactionId: "tx_30001",
      customerId: "830",
      walletId: "201",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 300,
      currency: "USD",
      reference: "Refund"
    }
  ],
  301: [
    {
      transactionId: "tx_40001",
      customerId: "848",
      walletId: "301",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "cancelled",
      type: "withdrawal",
      amount: 750,
      currency: "GBP",
      reference: "Suspicious activity"
    }
  ]
};

// User Service interface
interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getUserWallets(userId: string): Promise<Wallet[]>;
  getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]>;
  compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any>;
  generateRandomTransaction(): Promise<Transaction>;
}

// Helper functions for transaction generation
const generateRandomTransaction = (): Transaction => {
  // Get a random user
  const userIds = Object.keys(mockWallets).map(id => parseInt(id));
  const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
  
  // Get a random wallet for that user
  const userWallets = mockWallets[randomUserId];
  const randomWallet = userWallets[Math.floor(Math.random() * userWallets.length)];
  
  // Generate transaction types and statuses
  const transactionTypes = ["deposit", "withdrawal", "transfer", "payment", "refund"];
  const transactionStatuses = ["completed", "pending", "failed", "processing"];
  
  const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const randomStatus = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
  
  // Generate a random amount between 1 and 1000
  const randomAmount = parseFloat((Math.random() * 1000 + 1).toFixed(2));
  
  // Create the transaction
  const newTransaction: Transaction = {
    transactionId: `tx_${Date.now().toString()}`,
    customerId: randomUserId.toString(),
    walletId: randomWallet.id.toString(),
    date: new Date().toISOString(),
    status: randomStatus,
    type: randomType,
    amount: randomAmount,
    currency: randomWallet.currency || "USD",
    reference: `Auto-generated ${randomType}`
  };
  
  // Add the transaction to the mock data
  if (!mockTransactions[randomWallet.id]) {
    mockTransactions[randomWallet.id] = [];
  }
  mockTransactions[randomWallet.id].unshift(newTransaction);
  
  // Update wallet balance
  if (randomStatus === "completed") {
    if (randomType === "deposit" || randomType === "refund") {
      randomWallet.balance = (randomWallet.balance || 0) + randomAmount;
      randomWallet.availableBalance = (randomWallet.availableBalance || 0) + randomAmount;
    } else if (randomType === "withdrawal" || randomType === "payment") {
      randomWallet.balance = (randomWallet.balance || 0) - randomAmount;
      randomWallet.availableBalance = (randomWallet.availableBalance || 0) - randomAmount;
    }
  }
  
  return newTransaction;
};

// The actual service implementation that uses mock data
class UserServiceImpl implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    console.log("Using mock data for searchUsers", params);
    
    // Filter logic for mock data
    return mockUsers.filter(user => {
      if (params.name && !user.name.toLowerCase().includes(params.name.toLowerCase())) {
        return false;
      }
      if (params.surname && !user.surname.toLowerCase().includes(params.surname.toLowerCase())) {
        return false;
      }
      if (params.identifier && 
          !user.username.toLowerCase().includes(params.identifier.toLowerCase()) &&
          !user.email?.toLowerCase().includes(params.identifier.toLowerCase()) &&
          !user.phoneNumber?.includes(params.identifier)) {
        return false;
      }
      return true;
    });
  }

  async getUserData(userId: string): Promise<User> {
    console.log("Using mock data for getUserData");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    console.log("Using mock data for updateUser", userData);
    const userIndex = mockUsers.findIndex(u => u.id.toString() === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Update the user with new data
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    console.log("Using mock data for deleteUser");
    const index = mockUsers.findIndex(u => u.id.toString() === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  }

  async blockUser(userId: string): Promise<void> {
    console.log("Using mock data for blockUser");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.status = 'BLOCKED';
    }
  }

  async unblockUser(userId: string): Promise<void> {
    console.log("Using mock data for unblockUser");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.status = 'ACTIVE';
    }
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.log("Using mock data for getUserWallets", userId);
    // Return wallets for the specified user or empty array if none exist
    return mockWallets[parseInt(userId)] || [];
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    console.log("Using mock data for getWalletTransactions", userId, walletId);
    // Return transactions for the specified wallet or empty array if none exist
    return mockTransactions[parseInt(walletId)] || [];
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log("Using mock data for compensateCustomer");
    
    // Create a new transaction for the compensation
    const newTransaction: Transaction = {
      transactionId: `comp_${Date.now()}`,
      customerId: userId,
      walletId: walletId.toString(),
      date: new Date().toISOString(),
      status: "completed",
      type: "compensation",
      amount: parseFloat(request.amount),
      currency: mockWallets[parseInt(userId)]?.find(w => w.id === walletId)?.currency || "USD",
      reference: request.reason
    };
    
    // Add the transaction to the mock data
    if (!mockTransactions[walletId]) {
      mockTransactions[walletId] = [];
    }
    mockTransactions[walletId].unshift(newTransaction);
    
    // Update the wallet balance
    const wallet = mockWallets[parseInt(userId)]?.find(w => w.id === walletId);
    if (wallet) {
      wallet.balance = (wallet.balance || 0) + parseFloat(request.amount);
      wallet.availableBalance = (wallet.availableBalance || 0) + parseFloat(request.amount);
    }
    
    return { 
      message: `Compensated user ${userId} with ${request.amount}`,
      transactionId: newTransaction.transactionId
    };
  }

  async generateRandomTransaction(): Promise<Transaction> {
    console.log("Generating random transaction");
    return generateRandomTransaction();
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
