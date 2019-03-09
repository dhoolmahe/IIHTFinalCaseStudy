### IIHT FSD Project Management Case Study ###
--------------------------------------------

Frontend:
---------
		- Use 'ng-serve' and the application will be available in 'http://localhost:4200' (with default port)

Backend:
--------
		- Use 'mvn clean install' to add all the dependencies.
	    - Use 'mvn clean install sonar:sonar' to run the static analysis along with the code coverage reports using JaCaCoPlugin.
		- Use 'mvn spring-boot:run' to run the backend REST API application which will be available in 'http://localhost:7000'
		
GIT Repository
---------------
https://github.com/dhoolmahe/IIHTFinalCaseStudy.git



Note:

When building frontend as fresh setup , you might need below steps for solve the issue.

1) ng set --global warnings.packageDeprecation=false

2) npm install --save-dev @angular-devkit/build-angular