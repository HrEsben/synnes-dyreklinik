# Copilot Instructions for Synnes Dyreklinik

## Git Workflow

### Branch Strategy
- **develop**: Hovedbranch for udvikling. Arbejd altid på denne branch.
- **main**: Production branch. Kun merge fra develop når klar til deployment.

### Efter merge til main
Efter at have merged develop til main og pushed ændringerne, skal du ALTID:
1. Skifte tilbage til develop branch: `git checkout develop`
2. Bekræfte at brugeren er tilbage på develop og klar til videre arbejde

Dette sikrer at al ny udvikling sker på develop branch.
