dizmos = activities button device digitalSTROM usage zone
dizmos_with_children = digitalSTROM zone
main_dizmo = digitalSTROM

doit = @for dizmo in $($2);\
	   do\
	   cd $$dizmo; python manage.py $(1); cd ..;\
	done;\

make: grace_build clean_grace_mess
deploy: grace_deploy clean_grace_mess
clean: clean_grace_mess
	$(call doit,clean,dizmos)
zip: grace_zip clean_grace_mess

grace_zip:
	$(call doit,zip,main_dizmo)
	@cp digitalSTROM/build/*.dzm ./
grace_build: 
	$(call doit,build,main_dizmo)
grace_deploy: 
	$(call doit,deploy,dizmos)
clean_grace_mess: 
	@for dizmo in $(dizmos_with_children);\
	do\
		rm -f $$dizmo/assets/*.dzm;\
	done;\
