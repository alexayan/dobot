import os
from setuptools import find_packages
from setuptools import setup

f = open(os.path.join(os.path.dirname(__file__), 'README.rst'))
readme = f.read()
f.close()

try:
    from Cython.Build import cythonize
except ImportError:
    ext_modules = None
else:
    ext_modules = cythonize('playhouse/speedups.pyx')

setup(
    name='peewee',
    version=__import__('peewee').__version__,
    description='a little orm',
    long_description=readme,
    author='Charles Leifer',
    author_email='coleifer@gmail.com',
    url='http://github.com/coleifer/peewee/',
    package_data = {
        'playhouse': ['berkeley_build.sh']},
    packages=['playhouse'],
    py_modules=['peewee', 'pwiz'],
    ext_modules=ext_modules,
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
    ],
    test_suite='tests',
    scripts = ['pwiz.py'],
)
