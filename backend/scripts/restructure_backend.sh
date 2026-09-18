#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../src" && pwd)"
echo "Repertoire de base : ${BASE_DIR}"

# 1. Creation du socle transversal core/
mkdir -p "${BASE_DIR}/core/configs/env"
mkdir -p "${BASE_DIR}/core/configs/database"
mkdir -p "${BASE_DIR}/core/configs/swagger"

mkdir -p "${BASE_DIR}/core/middlewares/auth"
mkdir -p "${BASE_DIR}/core/middlewares/errors"
mkdir -p "${BASE_DIR}/core/middlewares/uploads"
mkdir -p "${BASE_DIR}/core/middlewares/validations"

mkdir -p "${BASE_DIR}/core/utils/helpers"
mkdir -p "${BASE_DIR}/core/utils/parsers"
mkdir -p "${BASE_DIR}/core/utils/swagger"
mkdir -p "${BASE_DIR}/core/utils/health"
mkdir -p "${BASE_DIR}/core/utils/responses"
mkdir -p "${BASE_DIR}/core/utils/security"

mkdir -p "${BASE_DIR}/core/types/global"
mkdir -p "${BASE_DIR}/core/types/epidemio"

mkdir -p "${BASE_DIR}/core/generics"

# 2. Creation des dossiers de l'agregateur GraphQL
mkdir -p "${BASE_DIR}/graphql/schemas"
mkdir -p "${BASE_DIR}/graphql/resolvers"
mkdir -p "${BASE_DIR}/graphql/servers"

# 3. Creation des routes globales et du point d'entree app
mkdir -p "${BASE_DIR}/routes/app"
mkdir -p "${BASE_DIR}/app"

# 4. Liste de toutes les features a creer avec sous-dossiers complets
FEATURES=(
  "auth"
  "user"
  "patient"
  "doctor"
  "appointment"
  "medical-record"
  "prescription"
  "disease"
  "symptom"
  "pharmacy"
  "medicine"
  "invoice"
  "payment"
  "discussion"
  "notification"
  "review"
  "hotspot"
  "stats"
  "upload"
)

for FEATURE in "${FEATURES[@]}"; do
  mkdir -p "${BASE_DIR}/features/${FEATURE}/controllers"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/services"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/routes"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/validations"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/interfaces"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/types"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/dtos"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/graphql/schemas"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/graphql/queries"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/graphql/mutations"
  mkdir -p "${BASE_DIR}/features/${FEATURE}/graphql/resolvers"
done

# 5. Deplacement des fichiers existants vers core/
[ -f "${BASE_DIR}/config/config.ts" ] && mv "${BASE_DIR}/config/config.ts" "${BASE_DIR}/core/configs/env/env.config.ts" || true
[ -f "${BASE_DIR}/config/database.ts" ] && mv "${BASE_DIR}/config/database.ts" "${BASE_DIR}/core/configs/database/database.config.ts" || true
[ -f "${BASE_DIR}/config/database-lifecycle.ts" ] && mv "${BASE_DIR}/config/database-lifecycle.ts" "${BASE_DIR}/core/configs/database/database-lifecycle.config.ts" || true
[ -f "${BASE_DIR}/config/swagger.ts" ] && mv "${BASE_DIR}/config/swagger.ts" "${BASE_DIR}/core/configs/swagger/swagger.config.ts" || true

[ -f "${BASE_DIR}/middleware/auth.middleware.ts" ] && mv "${BASE_DIR}/middleware/auth.middleware.ts" "${BASE_DIR}/core/middlewares/auth/auth.middleware.ts" || true
[ -f "${BASE_DIR}/middleware/error.middleware.ts" ] && mv "${BASE_DIR}/middleware/error.middleware.ts" "${BASE_DIR}/core/middlewares/errors/error.middleware.ts" || true
[ -f "${BASE_DIR}/middleware/upload.middleware.ts" ] && mv "${BASE_DIR}/middleware/upload.middleware.ts" "${BASE_DIR}/core/middlewares/uploads/upload.middleware.ts" || true
[ -f "${BASE_DIR}/middleware/validation.middleware.ts" ] && mv "${BASE_DIR}/middleware/validation.middleware.ts" "${BASE_DIR}/core/middlewares/validations/validation.middleware.ts" || true

[ -f "${BASE_DIR}/utils/helpers.ts" ] && mv "${BASE_DIR}/utils/helpers.ts" "${BASE_DIR}/core/utils/helpers/helpers.util.ts" || true
[ -f "${BASE_DIR}/utils/parseIdParam.ts" ] && mv "${BASE_DIR}/utils/parseIdParam.ts" "${BASE_DIR}/core/utils/parsers/parseIdParam.util.ts" || true
[ -f "${BASE_DIR}/utils/swagger-helpers.ts" ] && mv "${BASE_DIR}/utils/swagger-helpers.ts" "${BASE_DIR}/core/utils/swagger/swagger-helpers.util.ts" || true
[ -f "${BASE_DIR}/utils/health.ts" ] && mv "${BASE_DIR}/utils/health.ts" "${BASE_DIR}/core/utils/health/health.util.ts" || true

[ -f "${BASE_DIR}/types/index.ts" ] && mv "${BASE_DIR}/types/index.ts" "${BASE_DIR}/core/types/global/global.types.ts" || true
[ -f "${BASE_DIR}/types/epidemio.types.ts" ] && mv "${BASE_DIR}/types/epidemio.types.ts" "${BASE_DIR}/core/types/epidemio/epidemio.types.ts" || true

[ -f "${BASE_DIR}/gen/generic.controller.ts" ] && mv "${BASE_DIR}/gen/generic.controller.ts" "${BASE_DIR}/core/generics/generic.controller.ts" || true

# 6. Deplacement des fichiers controllers et routes vers les features correspondantes
[ -f "${BASE_DIR}/controllers/auth.controller.ts" ] && mv "${BASE_DIR}/controllers/auth.controller.ts" "${BASE_DIR}/features/auth/controllers/auth.controller.ts" || true
[ -f "${BASE_DIR}/routes/auth.routes.ts" ] && mv "${BASE_DIR}/routes/auth.routes.ts" "${BASE_DIR}/features/auth/routes/auth.routes.ts" || true

[ -f "${BASE_DIR}/controllers/user.controller.ts" ] && mv "${BASE_DIR}/controllers/user.controller.ts" "${BASE_DIR}/features/user/controllers/user.controller.ts" || true
[ -f "${BASE_DIR}/routes/user.routes.ts" ] && mv "${BASE_DIR}/routes/user.routes.ts" "${BASE_DIR}/features/user/routes/user.routes.ts" || true

[ -f "${BASE_DIR}/controllers/patient.controller.ts" ] && mv "${BASE_DIR}/controllers/patient.controller.ts" "${BASE_DIR}/features/patient/controllers/patient.controller.ts" || true
[ -f "${BASE_DIR}/routes/patient.routes.ts" ] && mv "${BASE_DIR}/routes/patient.routes.ts" "${BASE_DIR}/features/patient/routes/patient.routes.ts" || true

[ -f "${BASE_DIR}/controllers/doctor.controller.ts" ] && mv "${BASE_DIR}/controllers/doctor.controller.ts" "${BASE_DIR}/features/doctor/controllers/doctor.controller.ts" || true
[ -f "${BASE_DIR}/routes/doctor.routes.ts" ] && mv "${BASE_DIR}/routes/doctor.routes.ts" "${BASE_DIR}/features/doctor/routes/doctor.routes.ts" || true

[ -f "${BASE_DIR}/controllers/appointment.controller.ts" ] && mv "${BASE_DIR}/controllers/appointment.controller.ts" "${BASE_DIR}/features/appointment/controllers/appointment.controller.ts" || true
[ -f "${BASE_DIR}/routes/appointment.routes.ts" ] && mv "${BASE_DIR}/routes/appointment.routes.ts" "${BASE_DIR}/features/appointment/routes/appointment.routes.ts" || true

[ -f "${BASE_DIR}/controllers/medicalRecord.controller.ts" ] && mv "${BASE_DIR}/controllers/medicalRecord.controller.ts" "${BASE_DIR}/features/medical-record/controllers/medical-record.controller.ts" || true
[ -f "${BASE_DIR}/routes/medicalRecord.routes.ts" ] && mv "${BASE_DIR}/routes/medicalRecord.routes.ts" "${BASE_DIR}/features/medical-record/routes/medical-record.routes.ts" || true

[ -f "${BASE_DIR}/controllers/prescription.controller.ts" ] && mv "${BASE_DIR}/controllers/prescription.controller.ts" "${BASE_DIR}/features/prescription/controllers/prescription.controller.ts" || true
[ -f "${BASE_DIR}/routes/prescription.routes.ts" ] && mv "${BASE_DIR}/routes/prescription.routes.ts" "${BASE_DIR}/features/prescription/routes/prescription.routes.ts" || true

[ -f "${BASE_DIR}/controllers/disease.controller.ts" ] && mv "${BASE_DIR}/controllers/disease.controller.ts" "${BASE_DIR}/features/disease/controllers/disease.controller.ts" || true
[ -f "${BASE_DIR}/routes/disease.routes.ts" ] && mv "${BASE_DIR}/routes/disease.routes.ts" "${BASE_DIR}/features/disease/routes/disease.routes.ts" || true

[ -f "${BASE_DIR}/controllers/symptom.controller.ts" ] && mv "${BASE_DIR}/controllers/symptom.controller.ts" "${BASE_DIR}/features/symptom/controllers/symptom.controller.ts" || true
[ -f "${BASE_DIR}/routes/symptom.routes.ts" ] && mv "${BASE_DIR}/routes/symptom.routes.ts" "${BASE_DIR}/features/symptom/routes/symptom.routes.ts" || true

[ -f "${BASE_DIR}/controllers/pharmacy.controller.ts" ] && mv "${BASE_DIR}/controllers/pharmacy.controller.ts" "${BASE_DIR}/features/pharmacy/controllers/pharmacy.controller.ts" || true
[ -f "${BASE_DIR}/routes/pharmacy.routes.ts" ] && mv "${BASE_DIR}/routes/pharmacy.routes.ts" "${BASE_DIR}/features/pharmacy/routes/pharmacy.routes.ts" || true

[ -f "${BASE_DIR}/controllers/medicine.controller.ts" ] && mv "${BASE_DIR}/controllers/medicine.controller.ts" "${BASE_DIR}/features/medicine/controllers/medicine.controller.ts" || true
[ -f "${BASE_DIR}/routes/medicine.routes.ts" ] && mv "${BASE_DIR}/routes/medicine.routes.ts" "${BASE_DIR}/features/medicine/routes/medicine.routes.ts" || true

[ -f "${BASE_DIR}/controllers/invoice.controller.ts" ] && mv "${BASE_DIR}/controllers/invoice.controller.ts" "${BASE_DIR}/features/invoice/controllers/invoice.controller.ts" || true
[ -f "${BASE_DIR}/routes/invoice.routes.ts" ] && mv "${BASE_DIR}/routes/invoice.routes.ts" "${BASE_DIR}/features/invoice/routes/invoice.routes.ts" || true

[ -f "${BASE_DIR}/controllers/discussion.controller.ts" ] && mv "${BASE_DIR}/controllers/discussion.controller.ts" "${BASE_DIR}/features/discussion/controllers/discussion.controller.ts" || true
[ -f "${BASE_DIR}/routes/discussion.routes.ts" ] && mv "${BASE_DIR}/routes/discussion.routes.ts" "${BASE_DIR}/features/discussion/routes/discussion.routes.ts" || true

[ -f "${BASE_DIR}/controllers/notification.controller.ts" ] && mv "${BASE_DIR}/controllers/notification.controller.ts" "${BASE_DIR}/features/notification/controllers/notification.controller.ts" || true
[ -f "${BASE_DIR}/routes/notification.routes.ts" ] && mv "${BASE_DIR}/routes/notification.routes.ts" "${BASE_DIR}/features/notification/routes/notification.routes.ts" || true

[ -f "${BASE_DIR}/controllers/review.controller.ts" ] && mv "${BASE_DIR}/controllers/review.controller.ts" "${BASE_DIR}/features/review/controllers/review.controller.ts" || true
[ -f "${BASE_DIR}/routes/review.routes.ts" ] && mv "${BASE_DIR}/routes/review.routes.ts" "${BASE_DIR}/features/review/routes/review.routes.ts" || true

[ -f "${BASE_DIR}/controllers/hotspot.controller.ts" ] && mv "${BASE_DIR}/controllers/hotspot.controller.ts" "${BASE_DIR}/features/hotspot/controllers/hotspot.controller.ts" || true
[ -f "${BASE_DIR}/routes/hotspot.routes.ts" ] && mv "${BASE_DIR}/routes/hotspot.routes.ts" "${BASE_DIR}/features/hotspot/routes/hotspot.routes.ts" || true

[ -f "${BASE_DIR}/controllers/stats.controller.ts" ] && mv "${BASE_DIR}/controllers/stats.controller.ts" "${BASE_DIR}/features/stats/controllers/stats.controller.ts" || true
[ -f "${BASE_DIR}/routes/stats.routes.ts" ] && mv "${BASE_DIR}/routes/stats.routes.ts" "${BASE_DIR}/features/stats/routes/stats.routes.ts" || true

[ -f "${BASE_DIR}/controllers/upload.controller.ts" ] && mv "${BASE_DIR}/controllers/upload.controller.ts" "${BASE_DIR}/features/upload/controllers/upload.controller.ts" || true

# 7. Deplacement de index.routes.ts et index.ts
[ -f "${BASE_DIR}/routes/index.routes.ts" ] && mv "${BASE_DIR}/routes/index.routes.ts" "${BASE_DIR}/routes/app/index.routes.ts" || true
[ -f "${BASE_DIR}/index.ts" ] && mv "${BASE_DIR}/index.ts" "${BASE_DIR}/app/index.ts" || true

# 8. Nettoyage des anciens repertoires vides
rm -rf "${BASE_DIR}/config" || true
rm -rf "${BASE_DIR}/controllers" || true
rm -rf "${BASE_DIR}/middleware" || true
rm -rf "${BASE_DIR}/utils" || true
rm -rf "${BASE_DIR}/types" || true
rm -rf "${BASE_DIR}/gen" || true

echo "Restructuration des dossiers et deplacement termines avec succes."
