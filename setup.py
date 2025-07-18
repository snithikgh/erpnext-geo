    from setuptools import setup, find_packages

    setup(
        name='erpnext_geo',
        description='erpnext-geo',
        author='Sandeep',
        author_email='sandeep@snithik.com',
        packages=find_packages(),
        zip_safe=False,
        include_package_data=True,
        install_requires=('frappe',),
    )